import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const files = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
  ["/hangul.js", ["hangul.js", "text/javascript; charset=utf-8"]],
  ["/style.css", ["style.css", "text/css; charset=utf-8"]],
  ["/icon.svg", ["icon.svg", "image/svg+xml"]],
]);
const port = Number(process.env.PORT || 3200);
createServer(async (req, res) => {
  const entry = files.get(new URL(req.url, "http://localhost").pathname);
  if (!entry) { res.writeHead(404).end("Not found"); return; }
  try {
    const [filename, type] = entry;
    const content = await readFile(new URL("./docs/" + filename, import.meta.url));
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" }).end(content);
  } catch {
    res.writeHead(500).end("Unable to read the preview file.");
  }
}).listen(port, "127.0.0.1", () => console.log("Local: http://127.0.0.1:" + port));
