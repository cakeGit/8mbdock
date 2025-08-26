const fs = require('fs');
const path = require('path');

// Create a development server script with proper headers
const serverScript = `
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Add CORS and cross-origin isolation headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing - return index.html for all non-file requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
  console.log('Cross-origin isolation headers enabled for FFmpeg support');
});
`;

fs.writeFileSync(path.join(__dirname, 'server.js'), serverScript);
console.log('✅ Development server script created: server.js');
console.log('📦 Run "npm install express" then "node server.js" to start the server with proper headers');
