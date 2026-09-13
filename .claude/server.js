const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "_site");
const PORT = 4178;
const TYPES = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".json": "application/json", ".ico": "image/x-icon",
};

http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split("?")[0]);
  if (url.endsWith("/")) url += "index.html";
  const file = path.join(ROOT, url);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(PORT, () => console.log("TripDusk preview on http://localhost:" + PORT));
