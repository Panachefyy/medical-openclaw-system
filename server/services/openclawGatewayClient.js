import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { serverConfig } from "../config.js";

const REAL_SKILL_NAMES = {
  patient_summary: "Medical Document Processor + medical",
  lab_interpretation: "medical-terms + medical-qa",
  medication_advice: "medical-advice",
  medical_record_generation: "Medical Document Processor + medical-note-assistant",
  consultation_extraction: "medical-entity-extractor",
  diagnosis_suggestion: "medsyniq-lite + medical-research-toolkit",
  general_consultation_chat: "medical-qa"
};

const ACTION_INSTRUCTIONS = {
  patient_summary: "请使用 Medical Document Processor 和 medical 技能，基于患者上下文生成临床病情总结。",
  lab_interpretation: "请使用 medical-terms 和 medical-qa 技能，解读患者检查检验结果。",
  medication_advice: "请使用 medical-advice 技能，给出用药建议参考，必须注明仅供医生参考。",
  medical_record_generation: "请使用 Medical Document Processor 和 medical-note-assistant 技能，生成病历文书草稿。",
  consultation_extraction: "请使用 medical-entity-extractor 技能，从医患对话和病历中抽取结构化信息。",
  diagnosis_suggestion: "请使用 medsyniq-lite 和 medical-research-toolkit 技能，给出初步判断、鉴别诊断和下一步建议。",
  general_consultation_chat: "请使用 medical-qa 技能回答医生问题。"
};

const SKILL_RESULT_SCHEMA = {
  patient_summary: {
    summary: "",
    keyFindings: [],
    important: [{ label: "", value: "", level: "" }],
    medicationGroups: [{ label: "", count: 0 }],
    recommendations: []
  },
  lab_interpretation: {
    summary: "",
    abnormalItems: [
      {
        item: "",
        value: "",
        unit: "",
        reference: "",
        level: "normal | mild_high | high | low | critical | unknown",
        interpretation: ""
      }
    ],
    riskHints: [],
    recommendations: []
  },
  medication_advice: {
    summary: "string，整体用药评估",
    recommendations: ["string，每条一个具体建议"],
    cautions: ["string，注意事项"]
  },
  medical_record_generation: {
    recordDraft: "string，完整病历文书草稿，包含主诉/现病史/初步建议；可用 \\n 换行"
  },
  consultation_extraction: {
    chiefComplaint: "",
    presentIllness: "",
    symptoms: [],
    medications: [{ name: "", usage: "", purpose: "" }],
    labValues: [{ item: "", value: "", unit: "", abnormal: false, interpretation: "" }],
    diagnoses: [],
    actionItems: [],
    vitals: { bloodPressure: "", heartRate: "", temperature: "" },
    negativeSymptoms: [],
    patientConcerns: []
  },
  diagnosis_suggestion: {
    assessment: "string，整体判断",
    differential: ["string，鉴别诊断条目"],
    nextSteps: ["string，建议的检查/处置"]
  },
  general_consultation_chat: {
    summary: "string，回答正文（口语化）",
    keyFindings: ["string，可省略"],
    recommendations: ["string，可省略"]
  }
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jsonRpc(id, method, params) {
  return JSON.stringify({ jsonrpc: "2.0", id, method, params });
}

function extractMessageText(message) {
  if (!message) return "";
  if (message.delta?.text) return message.delta.text;
  if (typeof message.text === "string") return message.text;
  if (typeof message.content === "string") return message.content;
  if (Array.isArray(message.content)) {
    return message.content.map((item) => item.text || item.content || "").join("");
  }
  return "";
}

function tryParseJson(raw) {
  if (!raw) return null;
  let candidate = raw.trim();
  if (!candidate) return null;
  try {
    return JSON.parse(candidate);
  } catch (_) {
    // continue with repair attempts
  }
  // Strip trailing commas before } or ]
  const repaired = candidate
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
  try {
    return JSON.parse(repaired);
  } catch (_) {
    return null;
  }
}

function findJsonBlock(text) {
  if (!text) return null;
  const candidates = [];
  const fencedJson = [...text.matchAll(/```json\s*([\s\S]*?)```/gi)].map((m) => m[1]);
  const fencedAny = [...text.matchAll(/```\s*([\s\S]*?)```/g)].map((m) => m[1]);
  candidates.push(...fencedJson, ...fencedAny);
  // Largest balanced { ... } slice
  let depth = 0;
  let start = -1;
  let bestSpan = null;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0 && start !== -1) {
        const span = text.slice(start, i + 1);
        if (!bestSpan || span.length > bestSpan.length) bestSpan = span;
        start = -1;
      }
    }
  }
  if (bestSpan) candidates.push(bestSpan);

  for (const candidate of candidates) {
    const parsed = tryParseJson(candidate);
    if (parsed && typeof parsed === "object") return parsed;
  }
  return null;
}

function extractBullets(text) {
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const bullets = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^(?:[-*•·]|\d+[.、])\s*(.+)$/);
    if (m && m[1]) bullets.push(m[1].replace(/[*_`]/g, "").trim());
  }
  return bullets.slice(0, 12);
}

function extractSection(text, headers) {
  if (!text) return "";
  const escaped = headers.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const re = new RegExp(`(?:^|\\n)\\s*(?:#+\\s*)?(?:${escaped})\\s*[:：]?\\s*([\\s\\S]*?)(?=\\n\\s*(?:#+\\s*)?[\\u4e00-\\u9fa5A-Za-z][^\\n]{0,12}[:：]|$)`, "i");
  const match = text.match(re);
  return match ? match[1].trim().split(/\n\s*\n/)[0].trim() : "";
}

function firstSentence(text, max = 120) {
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  const idx = cleaned.search(/[。.!?！？]/);
  if (idx > 0) return cleaned.slice(0, idx + 1).trim();
  return cleaned.slice(0, max);
}

function fallbackStructured(skill, text) {
  const bullets = extractBullets(text);
  const summary = firstSentence(text);
  if (skill === "consultation_extraction") {
    return {
      chiefComplaint: extractSection(text, ["主诉", "Chief Complaint"]) || firstSentence(text, 60),
      presentIllness: extractSection(text, ["现病史", "History of Present Illness", "病史"]) || text,
      symptoms: extractBullets(extractSection(text, ["症状", "Symptoms"])) || [],
      medications: [],
      labValues: [],
      diagnoses: extractBullets(extractSection(text, ["诊断", "Diagnoses"])) || [],
      actionItems: extractBullets(extractSection(text, ["处理建议", "行动项", "Action Items", "建议"])) || [],
      vitals: {},
      negativeSymptoms: extractBullets(extractSection(text, ["否认", "阴性症状"])) || [],
      patientConcerns: extractBullets(extractSection(text, ["关注", "诉求", "患者关注"])) || []
    };
  }
  if (skill === "diagnosis_suggestion") {
    return {
      assessment: extractSection(text, ["评估", "判断", "Assessment"]) || summary || text,
      differential: extractBullets(extractSection(text, ["鉴别诊断", "Differential", "可能诊断"])) || bullets.slice(0, 4),
      nextSteps: extractBullets(extractSection(text, ["下一步", "建议", "Plan"])) || bullets.slice(-4)
    };
  }
  if (skill === "medical_record_generation") {
    return { recordDraft: text };
  }
  if (skill === "medication_advice") {
    return {
      summary,
      recommendations: bullets.length ? bullets : [text],
      cautions: extractBullets(extractSection(text, ["注意", "警告", "Caution"]))
    };
  }
  return {
    summary,
    keyFindings: extractBullets(extractSection(text, ["关键发现", "重点", "Key Findings"])) || bullets.slice(0, 6),
    recommendations: extractBullets(extractSection(text, ["建议", "Recommendation", "处置"])) || bullets.slice(-4)
  };
}

function stripJsonBlocksFromText(text) {
  if (!text) return "";
  return text
    .replace(/```json\s*[\s\S]*?```/gi, "")
    .replace(/```\s*\{[\s\S]*?\}\s*```/g, "")
    .trim();
}

function normalizeFinalResult(skill, text, usage) {
  const parsed = findJsonBlock(text);
  const naturalText = stripJsonBlocksFromText(text) || text;
  const hasParsed = parsed && typeof parsed === "object";
  const structured = hasParsed ? parsed.result || parsed.structured || parsed : fallbackStructured(skill, naturalText);
  const displayText = parsed?.displayText
    || parsed?.summary
    || (hasParsed && typeof structured?.summary === "string" ? structured.summary : "")
    || firstSentence(naturalText, 120)
    || naturalText;
  const confidenceRaw = parsed?.confidence;
  const confidence = typeof confidenceRaw === "number" ? confidenceRaw : Number(confidenceRaw) || null;
  return {
    skill,
    skillName: REAL_SKILL_NAMES[skill] || skill,
    displayText,
    result: structured,
    confidence: Number.isFinite(confidence) ? confidence : null,
    warnings: Array.isArray(parsed?.warnings) && parsed.warnings.length ? parsed.warnings : ["AI结果需结合医生临床判断"],
    parsedFromJson: hasParsed,
    usage
  };
}

function parseCliJson(stdout) {
  try {
    return JSON.parse(stdout);
  } catch (error) {
    const candidate = stdout.match(/\{[\s\S]*\}\s*$/)?.[0];
    if (!candidate) return null;
    try {
      return JSON.parse(candidate);
    } catch (innerError) {
      return null;
    }
  }
}

function extractCliText(stdout) {
  const parsed = parseCliJson(stdout);
  const payloads = parsed?.result?.payloads;
  if (Array.isArray(payloads)) {
    const text = payloads.map((item) => item.text || "").filter(Boolean).join("\n");
    if (text) return text;
  }
  return parsed?.result?.finalAssistantVisibleText || parsed?.result?.finalAssistantRawText || stdout;
}

function extractCliUsage(stdout) {
  const parsed = parseCliJson(stdout);
  return parsed?.result?.meta?.agentMeta?.usage || parsed?.result?.meta?.agentMeta?.lastCallUsage || null;
}

function buildPrompt({ skill, action, messages, patientContext }) {
  const latest = messages?.[messages.length - 1]?.content || "";
  const instruction = ACTION_INSTRUCTIONS[skill] || ACTION_INSTRUCTIONS.general_consultation_chat;
  const patient = patientContext?.basicInfo || {};
  const resultSchema = SKILL_RESULT_SCHEMA[skill] || SKILL_RESULT_SCHEMA.general_consultation_chat;

  const envelope = {
    displayText: "一句话面向医生的结论（口语化，不超过80字）",
    result: resultSchema,
    confidence: "0~1 之间的浮点数",
    warnings: ["AI结果需结合医生临床判断"]
  };

  return [
    instruction,
    "",
    "请优先使用已安装的医疗 skill；如需查询数据库，可通过已挂载的 sqlserver MCP 查询 emrtest。只查询完成任务必要的数据，不要遍历整库。",
    "",
    "【输出格式 - 严格遵守】",
    "回复必须分两段且只有两段：",
    "  1) 第一段：面向医生的自然语言结论（≤120 字，可换行）。",
    "  2) 第二段：单独一个 fenced ```json 代码块，键名/层级与下方模板完全一致；result 内的字段必须与该 skill 对应；不要省略任何键，没有内容时用空字符串或空数组占位。",
    "",
    "【JSON 模板 - 直接套用】",
    "```json",
    JSON.stringify(envelope, null, 2),
    "```",
    "",
    "强制要求：",
    "- 输出顺序：先自然语言段，再 ```json 块。",
    "- 不要把 JSON 放进自然语言里，也不要在 JSON 之后再补任何文字。",
    "- result 内**必须**严格按照模板列出的键，多余键允许，缺键不允许。",
    "- 数组字段如无内容请用 [] 占位，字符串用 \"\" 占位。",
    "- 仅输出标准 JSON：双引号、无注释、无尾随逗号。",
    "- consultation_extraction 必须提取 symptoms、medications、labValues、diagnoses、actionItems。",
    "- patient_summary 必须返回 keyFindings、important、medicationGroups、recommendations。",
    "- lab_interpretation 必须返回 abnormalItems、riskHints、recommendations。",
    "- 不要编造患者上下文中没有的事实；无法判断的字段使用空值或 unknown。",
    "",
    "患者索引字段（仅供查 EMR 时使用，请勿原样回显）：",
    JSON.stringify(
      {
        name: patient.name,
        patientId: patient.patientId,
        visitNo: patient.visitNo,
        medicalCard: patient.medicalCard,
        department: patient.department,
        doctor: patient.doctor
      },
      null,
      2
    ),
    "",
    "当前前端已整理的患者上下文（已脱敏，可直接基于此推理，无需再查 EMR 也可以完成任务）：",
    JSON.stringify(patientContext || {}, null, 2),
    "",
    "医生本轮请求：",
    latest || action || "请按上方说明执行该 skill 的标准动作。"
  ].join("\n");
}

export class OpenClawGatewayClient {
  constructor(config = serverConfig.openclaw) {
    this.config = config;
    this.nextId = 1;
  }

  async runSkill({ skill, action, messages, patientContext, onToken }) {
    if (this.config.transport === "cli") {
      return this.runSkillViaCli({ skill, action, messages, patientContext, onToken });
    }

    try {
      return await this.runSkillViaWs({ skill, action, messages, patientContext, onToken });
    } catch (error) {
      if (this.config.fallbackToCli === false) throw error;
      onToken?.(`\n[WS代理未完成调用，切换CLI调用：${error.message}]\n`);
      return this.runSkillViaCli({ skill, action, messages, patientContext, onToken });
    }
  }

  async runSkillViaWs({ skill, action, messages, patientContext, onToken }) {
    const ws = await this.connect();
    const pending = new Map();
    let sessionKey = "";
    let finalText = "";
    let finalUsage = null;
    let settled = false;

    const send = (method, params) => {
      const id = this.nextId++;
      ws.send(jsonRpc(id, method, params));
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`OpenClaw RPC 超时：${method}`));
        }, Math.min(this.config.timeoutMs, 15000));
        pending.set(id, {
          resolve: (value) => {
            clearTimeout(timer);
            resolve(value);
          },
          reject: (error) => {
            clearTimeout(timer);
            reject(error);
          }
        });
      });
    };

    const cleanup = () => {
      try {
        ws.close();
      } catch (error) {
        // no-op
      }
      pending.forEach((item) => item.reject(new Error("OpenClaw连接已关闭")));
      pending.clear();
    };

    const finalPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          cleanup();
          reject(new Error("OpenClaw Gateway 调用超时"));
        }
      }, this.config.timeoutMs);

      ws.addEventListener("message", (event) => {
        let packet;
        try {
          packet = JSON.parse(event.data);
        } catch (error) {
          return;
        }

        if (packet.id && pending.has(packet.id)) {
          const item = pending.get(packet.id);
          pending.delete(packet.id);
          if (packet.error) item.reject(new Error(packet.error.message || "OpenClaw JSON-RPC error"));
          else item.resolve(packet.result);
          return;
        }

        if (packet.method !== "chat.event") return;
        const params = packet.params || {};
        if (sessionKey && params.sessionKey && params.sessionKey !== sessionKey) return;

        if (params.state === "delta") {
          const token = extractMessageText(params.message);
          if (token) {
            finalText += token;
            onToken?.(token);
          }
        }

        if (params.state === "final") {
          const text = extractMessageText(params.message);
          if (text && !finalText.includes(text)) finalText += text;
          finalUsage = params.usage || params.message?.usage || null;
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            cleanup();
            resolve(normalizeFinalResult(skill, finalText || text, finalUsage));
          }
        }

        if (params.state === "error" || params.state === "aborted") {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            cleanup();
            reject(new Error(params.errorMessage || `OpenClaw ${params.state}`));
          }
        }
      });

      ws.addEventListener("error", () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(new Error("OpenClaw Gateway WebSocket 连接错误"));
        }
      });
    });
    finalPromise.catch(() => {});

    try {
      try {
        const resolved = await send("sessions.resolve", {
          label: this.config.sessionLabel,
          agentId: this.config.agentId
        });
        sessionKey = resolved?.key || `agent:${this.config.agentId}:${this.config.sessionLabel}`;
      } catch (error) {
        if (!/No session found|sessions\.resolve|超时/.test(error.message || "")) throw error;
        const created = await send("sessions.create", {
          label: this.config.sessionLabel,
          agentId: this.config.agentId
        });
        sessionKey = created?.key || `agent:${this.config.agentId}:${this.config.sessionLabel}`;
      }

      await send("sessions.messages.subscribe", { key: sessionKey });
      await send("sessions.send", {
        key: sessionKey,
        thinking: this.config.thinking,
        idempotencyKey: `medical-ui-${Date.now()}-${crypto.randomUUID()}`,
        message: buildPrompt({ skill, action, messages, patientContext })
      });
      return await finalPromise;
    } catch (error) {
      cleanup();
      throw error;
    }
  }

  runSkillViaCli({ skill, action, messages, patientContext, onToken }) {
    const prompt = buildPrompt({ skill, action, messages, patientContext });
    return new Promise((resolve, reject) => {
      const child = spawn("openclaw", ["agent", "--agent", this.config.agentId, "--json", "--message", prompt], {
        cwd: process.cwd(),
        env: process.env,
        stdio: ["ignore", "pipe", "pipe"]
      });
      let stdout = "";
      let stderr = "";
      let settled = false;
      const timer = setTimeout(() => {
        settled = true;
        child.kill("SIGTERM");
        reject(new Error("OpenClaw CLI 调用超时"));
      }, this.config.timeoutMs);

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString("utf8");
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString("utf8");
      });
      child.on("error", (error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(error);
      });
      child.on("close", async (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (code !== 0) {
          reject(new Error(stderr || `OpenClaw CLI exited with ${code}`));
          return;
        }
        const text = extractCliText(stdout);
        if (onToken) {
          const naturalText = stripJsonBlocksFromText(text) || text;
          const chunks = naturalText.match(/[\s\S]{1,24}/g) || [naturalText];
          for (const chunk of chunks) {
            onToken(chunk);
            await wait(20);
          }
        }
        resolve(normalizeFinalResult(skill, text, extractCliUsage(stdout)));
      });
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (!this.config.token) {
        reject(new Error("缺少 OPENCLAW_GATEWAY_TOKEN，或 ~/.openclaw/openclaw.json 中没有 gateway.auth.token"));
        return;
      }

      const ws = new WebSocket(this.config.wsUrl);
      const timer = setTimeout(() => {
        try {
          ws.close();
        } catch (error) {
          // no-op
        }
        reject(new Error("连接 OpenClaw Gateway 超时"));
      }, 10000);

      ws.addEventListener("open", async () => {
        try {
          ws.send(
            JSON.stringify({
              jsonrpc: "2.0",
              id: this.nextId++,
              method: "connect",
              params: {
                auth: { token: this.config.token }
              }
            })
          );
          await wait(80);
          clearTimeout(timer);
          resolve(ws);
        } catch (error) {
          clearTimeout(timer);
          reject(error);
        }
      });

      ws.addEventListener("error", () => {
        clearTimeout(timer);
        reject(new Error(`无法连接 OpenClaw Gateway：${this.config.wsUrl}`));
      });
    });
  }
}

export function createOpenClawGatewayClient() {
  return new OpenClawGatewayClient();
}
