import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serverConfig } from "./config.js";
import { createStaticFileHandler } from "./http/staticFiles.js";
import { handleApi } from "./routes/api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const forceFrontendMock = process.env.MEDICAL_FRONTEND_MOCK === "true";
const serveStatic = createStaticFileHandler({ rootDir, forceFrontendMock });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);

  try {
    if (url.pathname.startsWith("/api/")) {
      const handled = await handleApi(req, res, url);
      if (!handled) {
        res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ errorMessage: "API not found" }));
      }
      return;
    }

    serveStatic(req, res, url);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ errorMessage: error.message || "Server error" }));
  }
});

server.listen(serverConfig.port, "127.0.0.1", () => {
  console.log(`Medical OpenClaw workspace: http://127.0.0.1:${serverConfig.port}`);
  console.log(`OpenClaw Gateway WS: ${serverConfig.openclaw.wsUrl}`);
  if (forceFrontendMock) console.log("Frontend data mode: mock only");
});
