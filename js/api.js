(function () {
  const defaultConfig = {
    endpoint: "",
    stream: true,
    timeoutMs: 30000,
    headers: {}
  };

  function getConfig() {
    const fromWindow = window.OPENCLAW_CONFIG || {};
    let fromStorage = {};
    try {
      fromStorage = JSON.parse(localStorage.getItem("OPENCLAW_CONFIG") || "{}");
    } catch (error) {
      fromStorage = {};
    }
    return { ...defaultConfig, ...fromWindow, ...fromStorage };
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function pickMockReply(action, prompt) {
    const responses = window.MedicalMock.aiResponses;
    if (action === "summary") return responses.summary;
    if (action === "labs") return responses.labs;
    if (action === "medication") return responses.medication;
    if (action === "record") return responses.record;
    if (/血脂|检查|检验|LDL|TC|TG/i.test(prompt)) return responses.labs;
    if (/药|处方|用药/i.test(prompt)) return responses.medication;
    if (/病历|文书|记录/i.test(prompt)) return responses.record;
    return responses.summary;
  }

  async function streamMockReply({ action, prompt, onToken }) {
    const reply = pickMockReply(action, prompt);
    const chunks = reply.match(/.{1,6}/g) || [reply];
    for (const chunk of chunks) {
      await sleep(38);
      onToken(chunk);
    }
    return reply;
  }

  function parseSsePayload(line) {
    const value = line.replace(/^data:\s*/, "").trim();
    if (!value || value === "[DONE]") return "";
    try {
      const json = JSON.parse(value);
      return json.delta || json.content || json.text || json.choices?.[0]?.delta?.content || "";
    } catch (error) {
      return value;
    }
  }

  async function sendOpenClawMessage({ messages, patientContext, action, onToken }) {
    const config = getConfig();
    const lastMessage = messages[messages.length - 1]?.content || "";

    if (!config.endpoint) {
      return streamMockReply({ action, prompt: lastMessage, onToken });
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const response = await fetch(config.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...config.headers
        },
        body: JSON.stringify({
          messages,
          patientContext,
          action,
          stream: config.stream
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`OpenClaw API 请求失败：${response.status}`);
      }

      if (!config.stream || !response.body) {
        const data = await response.json();
        const content = data.content || data.text || data.message || "";
        onToken(content);
        return content;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";
      let buffered = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffered += decoder.decode(value, { stream: true });
        const lines = buffered.split(/\r?\n/);
        buffered = lines.pop() || "";

        for (const line of lines) {
          const token = line.startsWith("data:") ? parseSsePayload(line) : line;
          if (token) {
            fullText += token;
            onToken(token);
          }
        }
      }

      if (buffered.trim()) {
        const token = buffered.startsWith("data:") ? parseSsePayload(buffered) : buffered;
        fullText += token;
        onToken(token);
      }
      return fullText;
    } finally {
      window.clearTimeout(timer);
    }
  }

  window.OpenClawClient = {
    getConfig,
    sendMessage: sendOpenClawMessage
  };
})();
