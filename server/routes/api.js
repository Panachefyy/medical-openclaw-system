import { departmentOptions, getDepartmentDataset } from "../services/mockData.js";
import { createOpenClawGatewayClient } from "../services/openclawGatewayClient.js";
import { readJson, sendJson, sendSse } from "../http/responses.js";

function departmentFromUrl(url) {
  return getDepartmentDataset(url.searchParams.get("department") || "respiratory");
}

function findPatient(dataset, visitId, patientId) {
  const patients = dataset.patients;
  return patients.find((patient) => patient.visitNo === visitId || patient.id === patientId) || patients[0];
}

async function runOpenClawSkill(body, onToken) {
  const client = createOpenClawGatewayClient();
  return client.runSkill({
    skill: body.skill,
    action: body.action,
    messages: body.messages || [],
    patientContext: body.patientContext || {},
    onToken
  });
}

function startSse(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });
  res.write("\n");
}

export async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true, service: "medical-openclaw-system" });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/visits/today") {
    const dataset = departmentFromUrl(url);
    const status = url.searchParams.get("status");
    const filtered = status ? dataset.patients.filter((patient) => patient.status === status) : dataset.patients;
    sendJson(res, 200, { appMeta: dataset.appMeta, departmentOptions, patients: filtered, statusTabs: dataset.statusTabs });
    return true;
  }

  const contextMatch = url.pathname.match(/^\/api\/visits\/([^/]+)\/context$/);
  if (req.method === "GET" && contextMatch) {
    const dataset = departmentFromUrl(url);
    const patient = findPatient(dataset, decodeURIComponent(contextMatch[1]), url.searchParams.get("patientId"));
    sendJson(res, 200, dataset.buildContext(patient));
    return true;
  }

  if (req.method === "POST" && (url.pathname === "/api/openclaw/skill" || url.pathname === "/api/openclaw/chat")) {
    const body = await readJson(req);
    const wantsStream = body.stream !== false;

    if (wantsStream) {
      startSse(res);

      try {
        const result = await runOpenClawSkill(body, (token) => sendSse(res, "token", { content: token }));
        sendSse(res, "skill_result", result);
        sendSse(res, "done", {});
        res.end();
      } catch (error) {
        sendSse(res, "error", {
          errorMessage: error.message || "OpenClaw调用失败",
          errorKind: "openclaw_gateway_error"
        });
        res.end();
      }
      return true;
    }

    try {
      const result = await runOpenClawSkill(body);
      sendJson(res, 200, result);
    } catch (error) {
      sendJson(res, 502, {
        errorMessage: error.message || "OpenClaw调用失败",
        errorKind: "openclaw_gateway_error"
      });
    }
    return true;
  }

  return false;
}
