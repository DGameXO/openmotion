const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3000;
const PUBLIC_DIR = __dirname;
const REMOTE_HOST = "am.zervida.my.id";

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".xml": "application/xml",
  ".mp3": "audio/mpeg",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

// local effect catalog (id -> file in effects/)
let effectIndex = null;
function loadEffectIndex() {
  if (!effectIndex) {
    try {
      effectIndex = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, "effect-index.json"), "utf8"));
    } catch (e) {
      effectIndex = {};
    }
  }
  return effectIndex;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);
  if (pathname === "/") pathname = "/index.html";

  const localPath = path.join(PUBLIC_DIR, pathname);

  // Serve effect XML from local catalog (id -> file in effects/)
  if (pathname === "/api/effect-xml") {
    const params = new URLSearchParams(parsedUrl.query || "");
    const effectId = params.get("id");
    if (effectId) {
      const idx = loadEffectIndex();
      const file = idx[effectId] || (effectId.includes(".") ? idx[effectId.split(".").pop()] : null);
      if (file) {
        const full = path.join(PUBLIC_DIR, "effects", file);
        if (fs.existsSync(full) && fs.statSync(full).isFile()) {
          res.writeHead(200, {
            "Content-Type": "application/xml",
            "Cache-Control": "no-store",
            "X-Effect-File": file
          });
          return fs.createReadStream(full).pipe(res);
        }
      }
    }
  }

  // Check if effect binary exists in local cache
  if (pathname === "/api/effect-bin") {
    const params = new URLSearchParams(parsedUrl.query || "");
    const effectId = params.get("id");
    if (effectId) {
      const cachedBin = path.join(PUBLIC_DIR, "effects", `${effectId}.bin`);
      if (fs.existsSync(cachedBin) && fs.statSync(cachedBin).isFile()) {
        res.writeHead(200, { "Content-Type": "application/octet-stream" });
        return fs.createReadStream(cachedBin).pipe(res);
      }
    }
  }

  // Check if file exists locally
  if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
    const ext = path.extname(localPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const headers = { "Content-Type": contentType };
    if (["", ".html", ".js", ".json", ".css", ".xml"].includes(ext)) headers["Cache-Control"] = "no-store";
    res.writeHead(200, headers);
    return fs.createReadStream(localPath).pipe(res);
  }

  // Otherwise proxy to remote server (am.zervida.my.id)
  const remoteOptions = {
    hostname: REMOTE_HOST,
    port: 443,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: REMOTE_HOST,
      referer: `https://${REMOTE_HOST}/runtime/preset.html`
    }
  };

  const proxyReq = https.request(remoteOptions, (proxyRes) => {
    // Cache binary and preset files locally if successful
    if (proxyRes.statusCode === 200 && (pathname.startsWith("/api/") || pathname.startsWith("/preset/"))) {
      const cacheFile = path.join(PUBLIC_DIR, pathname.replace(/\//g, "_"));
    }

    // Override cache policy for code files so the browser never pins a stale
    // 404/error (the remote proxy can send cache-control: max-age=14400).
    if (req.url.match(/\.(html|js|json|css|xml)(\?|$)/)) proxyRes.headers["cache-control"] = "no-store";

    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Proxy Error: " + err.message);
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`AM Web Server running at http://localhost:${PORT}/`);
});
