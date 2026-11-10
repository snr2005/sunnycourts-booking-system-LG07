// testServer.js
const { spawn } = require('child_process');
const http = require('http');

// Start the Express server as a child process
const server = spawn('node', ['src/server.js'], { stdio: 'inherit' });

// Give the server a moment to start up
setTimeout(() => {
  http.get('http://localhost:3000', (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('\n--- SERVER RESPONSE ---');
      console.log(body);
      // Gracefully stop the server
      server.kill('SIGINT');
    });
  }).on('error', err => {
    console.error('Request error:', err);
    server.kill('SIGINT');
  });
}, 2000);

