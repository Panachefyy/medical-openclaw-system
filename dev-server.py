#!/usr/bin/env python3
import argparse
import os
import posixpath
import threading
import time
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlparse


WATCH_EXTENSIONS = {".html", ".css", ".js", ".svg", ".webmanifest"}
IGNORE_DIRS = {".git", ".DS_Store", "__pycache__"}


def latest_mtime(root):
  newest = 0.0
  for current_root, dirs, files in os.walk(root):
    dirs[:] = [name for name in dirs if name not in IGNORE_DIRS]
    for name in files:
      if os.path.splitext(name)[1] not in WATCH_EXTENSIONS:
        continue
      try:
        newest = max(newest, os.path.getmtime(os.path.join(current_root, name)))
      except OSError:
        pass
  return newest


LIVE_RELOAD_HEAD = """
<script>
  window.DISABLE_SERVICE_WORKER = true;
</script>
"""


LIVE_RELOAD_BODY = """
<script>
(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => registrations.forEach((registration) => registration.unregister()))
      .catch(() => {});
  }

  const source = new EventSource("/__live-reload");
  source.addEventListener("change", () => {
    window.location.reload();
  });
})();
</script>
"""


class LiveReloadHandler(SimpleHTTPRequestHandler):
  server_version = "MedicalDemoLiveReload/1.0"

  def end_headers(self):
    self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
    super().end_headers()

  def do_GET(self):
    if urlparse(self.path).path == "/__live-reload":
      self.handle_live_reload()
      return
    super().do_GET()

  def translate_path(self, path):
    parsed = urlparse(path)
    clean_path = posixpath.normpath(unquote(parsed.path))
    words = [word for word in clean_path.split("/") if word]
    full_path = self.directory
    for word in words:
      drive, word = os.path.splitdrive(word)
      head, word = os.path.split(word)
      if word in (os.curdir, os.pardir):
        continue
      full_path = os.path.join(full_path, word)
    return full_path

  def send_head(self):
    path = self.translate_path(self.path)
    if os.path.isdir(path):
      path = os.path.join(path, "index.html")
    if os.path.basename(path) == "index.html":
      return self.send_live_index(path)
    return super().send_head()

  def send_live_index(self, path):
    try:
      with open(path, "r", encoding="utf-8") as file:
        content = file.read()
    except OSError:
      self.send_error(HTTPStatus.NOT_FOUND, "File not found")
      return None

    content = content.replace("</head>", f"{LIVE_RELOAD_HEAD}</head>")
    content = content.replace("</body>", f"{LIVE_RELOAD_BODY}</body>")
    encoded = content.encode("utf-8")

    self.send_response(HTTPStatus.OK)
    self.send_header("Content-Type", "text/html; charset=utf-8")
    self.send_header("Content-Length", str(len(encoded)))
    self.end_headers()
    self.wfile.write(encoded)
    return None

  def handle_live_reload(self):
    self.send_response(HTTPStatus.OK)
    self.send_header("Content-Type", "text/event-stream")
    self.send_header("Cache-Control", "no-cache")
    self.send_header("Connection", "keep-alive")
    self.end_headers()

    last_seen = latest_mtime(self.directory)
    while True:
      time.sleep(0.7)
      current = latest_mtime(self.directory)
      if current > last_seen:
        last_seen = current
        try:
          self.wfile.write(b"event: change\ndata: reload\n\n")
          self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
          break


def main():
  parser = argparse.ArgumentParser(description="Static dev server with live reload.")
  parser.add_argument("--host", default="127.0.0.1")
  parser.add_argument("--port", type=int, default=4174)
  parser.add_argument("--dir", default=os.getcwd())
  args = parser.parse_args()

  root = os.path.abspath(args.dir)

  def handler(*handler_args, **handler_kwargs):
    return LiveReloadHandler(*handler_args, directory=root, **handler_kwargs)

  server = ThreadingHTTPServer((args.host, args.port), handler)
  print(f"Serving {root}")
  print(f"Live reload: http://{args.host}:{args.port}/")
  server.serve_forever()


if __name__ == "__main__":
  main()
