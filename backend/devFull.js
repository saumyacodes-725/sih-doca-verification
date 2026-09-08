import { spawn } from 'node:child_process';

const commands = [
  { name: 'backend', command: process.execPath, args: ['backend/server.js'] },
  { name: 'frontend', command: 'npx', args: ['vite', '--host', '127.0.0.1'], shell: true }
];

const children = commands.map(({ name, command, args, shell }) => {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: process.env,
    shell: Boolean(shell),
    stdio: ['inherit', 'pipe', 'pipe']
  });

  child.stdout.on('data', (data) => process.stdout.write(`[${name}] ${data}`));
  child.stderr.on('data', (data) => process.stderr.write(`[${name}] ${data}`));
  child.on('exit', (code) => {
    if (code && code !== 0) {
      process.exitCode = code;
    }
  });

  return child;
});

function shutdown() {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
