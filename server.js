const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, "ssl", "key.pem")),  // ✅ FIXED PATH
    cert: fs.readFileSync(path.join(__dirname, "ssl", "cert.pem")), // ✅ FIXED PATH
};

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(port, () => {
        console.log(`> Server running at https://localhost:${port}`);
    });
});
