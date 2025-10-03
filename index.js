// Simple Node.js web proxy (unblocker)
// Install dependencies: npm install express http-proxy-middleware

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Main proxy route
app.use('/proxy', (req, res, next) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing url parameter.');
  }
  // Remove /proxy from path and proxy to targetUrl
  createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: { '^/proxy': '' },
    onProxyReq(proxyReq, req, res) {
      // Optional: You can add custom headers here
    },
    onError(err, req, res) {
      res.status(502).send('Proxy error: ' + err.message);
    },
    secure: false,
  })(req, res, next);
});

// Home page with instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Simple Unblocker</h1>
    <p>Usage: /proxy?url=https://blockedsite.com</p>
  `);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Unblocker running on port', PORT);
});
