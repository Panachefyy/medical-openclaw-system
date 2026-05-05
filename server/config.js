import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function readOpenClawConfig() {
  const configPath = process.env.OPENCLAW_CONFIG_PATH || path.join(os.homedir(), ".openclaw", "openclaw.json");
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    return {};
  }
}

const openclawConfig = readOpenClawConfig();

export const serverConfig = {
  port: Number(process.env.PORT || 3000),
  openclaw: {
    wsUrl: process.env.OPENCLAW_WS_URL || "ws://127.0.0.1:18789",
    token: process.env.OPENCLAW_GATEWAY_TOKEN || openclawConfig?.gateway?.auth?.token || "",
    sessionLabel: process.env.OPENCLAW_SESSION_LABEL || "main",
    agentId: process.env.OPENCLAW_AGENT_ID || "main",
    thinking: process.env.OPENCLAW_THINKING || "low",
    timeoutMs: Number(process.env.OPENCLAW_TIMEOUT_MS || 120000),
    transport: process.env.OPENCLAW_TRANSPORT || "cli",
    fallbackToCli: process.env.OPENCLAW_FALLBACK_TO_CLI !== "false"
  }
};
