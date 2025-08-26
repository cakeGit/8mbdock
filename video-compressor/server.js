
const express = require('express');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3001;

// Add CORS and cross-origin isolation headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// Proxy for FFmpeg core files to avoid CORS issues
app.get('/ffmpeg-proxy/*', (req, res) => {
  const ffmpegPath = req.params[0];
  const ffmpegUrl = `https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/${ffmpegPath}`;
  
  console.log(`Proxying FFmpeg resource: ${ffmpegUrl}`);
  
  const request = https.get(ffmpegUrl, (proxyRes) => {
    // Set CORS headers for the proxied resource
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Content-Type', proxyRes.headers['content-type']);
    res.setHeader('Content-Length', proxyRes.headers['content-length']);
    
    proxyRes.pipe(res);
  });
  
  request.on('error', (err) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error');
  });
});

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing - return index.html for all non-file requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Cross-origin isolation headers enabled for FFmpeg support');
  console.log('FFmpeg proxy available at /ffmpeg-proxy/*');
});
