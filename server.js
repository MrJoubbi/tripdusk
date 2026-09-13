const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = "0.0.0.0";

// Prefer _site (Eleventy default output), fallback to dist or current dir
function getDocRoot() {
  const siteDir = path.resolve(__dirname, "_site");
  if (fs.existsSync(siteDir)) return siteDir;
  const distDir = path.resolve(__dirname, "dist");
  if (fs.existsSync(distDir)) return distDir;
  return __dirname;
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json"
};

const server = http.createServer((req, res) => {
  const docRoot = getDocRoot();
  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(req.url.split("?")[0]);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Bad Request");
  }

  let filePath = path.join(docRoot, decodedUrl);

  // Prevent directory traversal
  if (!filePath.startsWith(docRoot)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("Forbidden");
  }

  // Check stat
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
      return serveFile(filePath, req, res);
    }

    if (!err && stats.isFile()) {
      return serveFile(filePath, req, res);
    }

    // Try clean URL (.html extension)
    const htmlCandidate = filePath + ".html";
    fs.stat(htmlCandidate, (htmlErr, htmlStats) => {
      if (!htmlErr && htmlStats.isFile()) {
        return serveFile(htmlCandidate, req, res);
      }

      // Try /index.html if path had trailing slash or sub-path
      const indexCandidate = path.join(filePath, "index.html");
      fs.stat(indexCandidate, (idxErr, idxStats) => {
        if (!idxErr && idxStats.isFile()) {
          return serveFile(indexCandidate, req, res);
        }

        // 404 Not Found
        const notFoundPage = path.join(docRoot, "404.html");
        fs.stat(notFoundPage, (nfErr, nfStats) => {
          if (!nfErr && nfStats.isFile()) {
            res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
            return fs.createReadStream(notFoundPage).pipe(res);
          }
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
        });
      });
    });
  });
});

function serveFile(targetFile, req, res) {
  const ext = path.extname(targetFile).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.stat(targetFile, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Not Found");
    }

    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stat.size
    });

    if (req.method === "HEAD") {
      return res.end();
    }

    fs.createReadStream(targetFile).pipe(res);
  });
}

server.listen(PORT, HOST, () => {
  console.log(`TripDusk server running on http://${HOST}:${PORT}`);
});
