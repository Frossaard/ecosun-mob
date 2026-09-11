#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let attemptedTunnel = false;
const logFile = path.join(__dirname, '..', 'expo-tunnel.log');

function appendLog(line) {
  try {
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${line}\n`);
  } catch (e) {
    // ignore logging errors
  }
}

function spawnExpo(mode) {
  const args = ['expo', 'start', mode];
  const env = Object.assign({}, process.env, { EXPO_DEBUG: '1' });
  appendLog(`spawning: npx ${args.join(' ')} env.EXPO_DEBUG=1`);

  const proc = spawn('npx', args, { stdio: ['inherit', 'pipe', 'pipe'], env });

  proc.stdout.on('data', (d) => {
    const s = d.toString();
    process.stdout.write(s);
    appendLog(s.trim());
  });
  proc.stderr.on('data', (d) => {
    const s = d.toString();
    process.stderr.write(s);
    appendLog(`ERR: ${s.trim()}`);
    if (!attemptedTunnel && s.includes("Cannot read properties of undefined (reading 'body')")) {
      attemptedTunnel = true;
      console.error('\n[Tunnel error detected] Falling back to LAN...');
      appendLog('Detected "reading \'body\'" error, falling back to LAN');
      try { proc.kill(); } catch (e) { appendLog('failed to kill process:' + e.message); }
      // small delay to let resources free
      setTimeout(() => spawnExpo('--lan'), 500);
    }
  });

  proc.on('exit', (code) => {
    appendLog(`process exited with code ${code}`);
    if (code !== 0 && mode === '--tunnel' && !attemptedTunnel) {
      attemptedTunnel = true;
      console.log('[Tunnel exit] Non-zero exit, falling back to LAN');
      appendLog('non-zero exit while tunneling, falling back to LAN');
      spawnExpo('--lan');
      return;
    }
    process.exit(code === null ? 0 : code);
  });
}

const preferLan = process.env.EXPO_PREFER_LAN === '1';
if (preferLan) {
  console.log('[EXPO_PREFER_LAN=1] Starting with LAN');
  appendLog('EXPO_PREFER_LAN=1 forcing LAN');
  spawnExpo('--lan');
} else {
  console.log('Starting Expo (attempting tunnel, will fallback to LAN on failure)');
  appendLog('starting with tunnel, will fallback to lan on failure');
  spawnExpo('--tunnel');
}
