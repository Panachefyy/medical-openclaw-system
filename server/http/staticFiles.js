import fs from "node:fs";
import path from "node:path";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function safeJoin(root, requestPath) {
  const normalized = path.normalize(decodeURIComponent(requestPath)).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(root, normalized);
  const relative = path.relative(root, fullPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return fullPath;
}

function frontendMockConfigScript() {
  return [
    "<script>",
    "window.MEDICAL_APP_CONFIG = {",
    '  apiBaseUrl: "",',
    "  openclaw: { stream: true }",
    "};",
    "</script>"
  ].join("\n");
}

export function createStaticFileHandler({ rootDir, forceFrontendMock = false }) {
  return function serveStatic(req, res, url) {
    const requestPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = safeJoin(rootDir, requestPath);

    if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    if (forceFrontendMock && requestPath === "/index.html") {
      const html = fs.readFileSync(filePath, "utf8");
      const body = html.replace("</head>", `${frontendMockConfigScript()}\n  </head>`);
      res.writeHead(200, {
        "Content-Type": mimeTypes[ext],
        "Cache-Control": "no-cache"
      });
      res.end(body);
      return;
    }

    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    fs.createReadStream(filePath).pipe(res);
  };
}
