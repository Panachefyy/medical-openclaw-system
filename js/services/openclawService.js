(function () {
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function primaryDiagnosis(patientContext) {
    return patientContext?.diagnoses?.[0] || patientContext?.basicInfo?.department || "待评估";
  }

  function medicationGroups(medications) {
    return [
      { label: "当前用药", count: Array.isArray(medications) ? medications.length : 0 }
    ];
  }

  function mockResultFor(skill, patientContext) {
    const patient = patientContext?.basicInfo || {};
    const diagnosis = primaryDiagnosis(patientContext);
    const medications = patientContext?.medications || [];
    const labs = patientContext?.labs || [];
    const exams = patientContext?.exams || {};
    const firstExam = exams.imaging?.[0]?.desc || exams.ultrasound?.[0]?.desc || "暂无关键检查结论";
    const labNames = labs.slice(0, 3).map((item) => `${item.item || "检验"} ${item.result || ""}${item.unit || ""}`.trim());
    const recommendations = [
      "结合主诉、病史、体征和检查结果综合判断",
      "复核当前用药、过敏史及近期依从性",
      "根据病情变化安排复查和随访"
    ];
    const summary = `${patient.name || "患者"}，${patient.age || "--"}岁，${diagnosis}，当前资料已汇总，需结合检查检验和用药情况继续评估。`;

    if (skill === "lab_interpretation") {
      return {
        displayText: labNames.length ? `近期检验重点：${labNames.join("；")}。` : "暂无可解读的检验数据。",
        result: { keyFindings: labNames, recommendations },
        confidence: 0.78
      };
    }
    if (skill === "medication_advice") {
      return {
        displayText: medications.length ? `当前记录 ${medications.length} 种用药，建议结合诊断、过敏史和肝肾功能复核。` : "暂无长期用药记录，建议补充患者自述和处方信息。",
        result: { recommendations },
        confidence: 0.76,
        warnings: ["用药建议仅供医生参考"]
      };
    }
    if (skill === "medical_record_generation") {
      return {
        displayText: "已生成病历文书草稿。",
        result: {
          recordDraft: `主诉：${diagnosis}相关问题待完善。\n现病史：${summary}\n检查检验：${firstExam}。\n处理建议：${recommendations.join("；")}。`
        },
        confidence: 0.78
      };
    }
    if (skill === "consultation_extraction") {
      return {
        displayText: "已从当前上下文中提取主诉、现病史和患者关注点。",
        result: {
          chiefComplaint: `${diagnosis}相关症状待进一步问诊`,
          presentIllness: summary,
          vitals: patientContext?.vitals || {},
          negativeSymptoms: [],
          patientConcerns: ["检查结果", "后续治疗方案"]
        },
        confidence: 0.8
      };
    }
    if (skill === "diagnosis_suggestion") {
      return {
        displayText: `初步考虑 ${diagnosis}，建议结合影像、检验和用药反应继续评估。`,
        result: {
          assessment: summary,
          differential: [diagnosis, "合并感染或急性加重待排", "用药依从性或诱因相关问题"],
          nextSteps: recommendations
        },
        confidence: 0.79
      };
    }
    return {
      displayText: summary,
      result: {
        summary,
        keyFindings: [diagnosis, firstExam, ...labNames].filter(Boolean),
        important: [
          { label: "过敏史", value: patient.allergy || "无" },
          { label: "本次诊断", value: diagnosis },
          { label: "当前用药", value: medications.length ? `${medications.length} 种` : "暂无记录" }
        ],
        medicationGroups: medicationGroups(medications),
        recommendations
      },
      confidence: 0.82,
      warnings: ["AI结果需结合医生临床判断"]
    };
  }

  function parseSseLine(line) {
    if (!line.trim()) return null;
    if (line.startsWith("event:")) return { event: line.replace(/^event:\s*/, "").trim() };
    if (!line.startsWith("data:")) return { data: line };
    const text = line.replace(/^data:\s*/, "").trim();
    if (!text || text === "[DONE]") return { done: true };
    try {
      return { data: JSON.parse(text) };
    } catch (error) {
      return { data: { content: text } };
    }
  }

  function readTokenFromPayload(payload) {
    return payload?.content || payload?.delta || payload?.text || payload?.choices?.[0]?.delta?.content || "";
  }

  async function runMockSkill({ skill, patientContext, onToken, onSkillResult }) {
    const result = mockResultFor(skill, patientContext);
    const text = result.displayText || "";
    const chunks = text.match(/.{1,7}/g) || [text];
    for (const chunk of chunks) {
      await sleep(35);
      onToken?.(chunk);
    }
    await sleep(120);
    onSkillResult?.(result);
    return result;
  }

  async function runSkill({ skill, action, messages, patientContext, onToken, onSkillResult }) {
    const config = window.AppConfig.getConfig();
    const endpoint = skill === "general_consultation_chat" ? config.openclaw.chatEndpoint : config.openclaw.skillEndpoint;

    if (!config.apiBaseUrl) {
      return runMockSkill({ skill, patientContext, onToken, onSkillResult });
    }

    const response = await window.HttpClient.request(endpoint, {
      method: "POST",
      raw: true,
      timeoutMs: config.openclaw.timeoutMs,
      headers: config.openclaw.headers,
      body: {
        skill,
        action,
        messages,
        patientContext,
        stream: config.openclaw.stream
      }
    });

    if (!config.openclaw.stream || !response.body) {
      const payload = await response.json();
      onSkillResult?.(payload);
      return payload;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let eventName = "";
    let finalResult = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || "";

      for (const line of lines) {
        const parsed = parseSseLine(line);
        if (!parsed) continue;
        if (parsed.event) {
          eventName = parsed.event;
          continue;
        }
        if (parsed.done) break;
        const payload = parsed.data;
        if (eventName === "error" || payload?.errorMessage || payload?.error) {
          throw new Error(payload?.errorMessage || payload?.error || "OpenClaw调用失败");
        }
        if (eventName === "skill_result" || payload?.result || payload?.structured) {
          finalResult = payload;
          onSkillResult?.(payload);
        } else {
          const token = readTokenFromPayload(payload);
          if (token) onToken?.(token);
        }
        eventName = "";
      }
    }

    if (buffer.trim()) {
      const parsed = parseSseLine(buffer);
      const token = readTokenFromPayload(parsed?.data);
      if (token) onToken?.(token);
    }

    return finalResult;
  }

  window.OpenClawSkillService = {
    runSkill
  };
})();
