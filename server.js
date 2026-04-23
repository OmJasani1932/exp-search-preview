import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

// The real API domain — all /apis/* requests get forwarded here
const API_TARGET = process.env.API_TARGET || 'https://admin-local.experro-dev.app';

const app = express();

// Proxy: /apis/* → https://admin-local.experro-dev.app/apis/*
app.use(
  '/apis',
  createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    // path stays the same (/apis/discovery/search/...) — only the domain changes
  }),
);

// Serve the built frontend
app.use(express.static(join(__dirname, 'dist')));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Search Debugger running at http://localhost:${PORT}`);
  console.log(`   API proxy → ${API_TARGET}/apis/*`);
});
