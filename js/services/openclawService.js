(function () {
  const mockSkillResults = {
    patient_summary: {
      displayText: "患者为65岁男性，高血压病史10年，近期血压波动并伴头晕、心慌。检查提示LDL-C偏高及颈动脉斑块形成，整体心血管风险中高。",
      result: {
        summary: "高血压病史10年，血压控制不稳定，伴血脂异常，存在动脉粥样硬化风险。",
        keyFindings: ["高血压病史10年", "血压控制不稳定", "LDL-C偏高", "动脉粥样硬化风险", "超重（BMI 25.5）"],
        important: [
          { label: "过敏史", value: "青霉素过敏", level: "danger" },
          { label: "目前病情", value: "晨起头晕、心慌，家庭血压最高160/95mmHg" },
          { label: "心血管风险", value: "中高危，需关注颈动脉斑块和LDL-C目标", level: "danger" }
        ],
        medicationGroups: [
          { label: "降压药", count: 3 },
          { label: "调脂药", count: 1 },
          { label: "其他", count: 1 }
        ],
        recommendations: ["复核家庭血压记录与服药依从性", "评估降压方案是否需要调整", "强化LDL-C达标管理"]
      },
      confidence: 0.86,
      warnings: ["AI结果需结合医生临床判断"]
    },
    lab_interpretation: {
      displayText: "最新血脂显示LDL-C 2.48 mmol/L，较高危患者建议目标仍偏高。TC、TG在参考范围内，HDL-C尚可。",
      result: {
        keyFindings: ["LDL-C 2.48 mmol/L", "动脉粥样硬化风险需持续管理"],
        recommendations: ["结合依从性评估强化他汀或联合调脂治疗", "建议定期复查血脂四项"]
      },
      confidence: 0.82
    },
    medication_advice: {
      displayText: "建议复核氨氯地平、厄贝沙坦服药时间和依从性；若家庭血压持续高于目标，可考虑调整联合降压方案。调脂方面关注LDL-C目标达成。",
      result: {
        recommendations: ["确认降压药规律服用", "关注夜间及晨峰血压", "评估他汀强化或联合用药"]
      },
      confidence: 0.78,
      warnings: ["用药建议仅供医生参考"]
    },
    medical_record_generation: {
      displayText: "已生成病历文书草稿。",
      result: {
        recordDraft: "主诉：头晕伴心慌1周。\n现病史：患者近1周晨起头晕明显，偶有心慌，家庭自测血压最高160/95mmHg，服药后145/88mmHg，伴乏力及活动后气促，否认明显胸痛及下肢水肿。\n初步建议：结合检查结果评估降压及调脂方案。"
      },
      confidence: 0.8
    },
    consultation_extraction: {
      displayText: "已从当前医患对话中提取主诉、现病史和患者关注点。",
      result: {
        chiefComplaint: "头晕伴心慌1周",
        presentIllness: "晨起头晕明显，家庭自测血压最高160/95mmHg，服药后145/88mmHg，伴乏力及活动后气促。",
        vitals: { bloodPressure: "160/95 mmHg（晨起），145/88 mmHg（服药后）" },
        negativeSymptoms: ["否认明显胸痛", "否认下肢水肿"],
        patientConcerns: ["血脂复查结果"]
      },
      confidence: 0.84
    },
    diagnosis_suggestion: {
      displayText: "考虑血压控制不佳，合并血脂异常及动脉粥样硬化风险。建议结合心电图、心脏超声及血脂结果进一步评估。",
      result: {
        assessment: "高血压控制不稳定，合并血脂异常，心血管风险中高。",
        differential: ["原发性高血压控制不佳", "继发性高血压待排", "心律失常待排"],
        nextSteps: ["完善心电图", "复核家庭血压记录", "评估降压及调脂方案"]
      },
      confidence: 0.81
    }
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

  async function runMockSkill({ skill, onToken, onSkillResult }) {
    const result = mockSkillResults[skill] || mockSkillResults.patient_summary;
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
      return runMockSkill({ skill, onToken, onSkillResult });
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
