const { spawn } = require('node:child_process');
const path = require('node:path');

const rootDirectory = path.resolve(__dirname, '..');
const apiScript = path.join(__dirname, 'server.js');
const ngBinary = path.join(
  rootDirectory,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'ng.cmd' : 'ng'
);
const angularArgs = ['serve', ...process.argv.slice(2)];

let isStopping = false;

const apiProcess = spawn(process.execPath, [apiScript], {
  cwd: rootDirectory,
  env: {
    ...process.env,
    API_HOST: process.env.API_HOST || '127.0.0.1',
    API_PORT: process.env.API_PORT || '3000',
  },
  stdio: 'inherit',
});

const angularProcess = spawn(ngBinary, angularArgs, {
  cwd: rootDirectory,
  stdio: 'inherit',
});

apiProcess.on('exit', (code, signal) => {
  if (!isStopping) {
    console.error(`API server stopped (${signal || code}).`);
    stopAll(code || 1);
  }
});

angularProcess.on('exit', (code, signal) => {
  if (!isStopping) {
    console.error(`Angular dev server stopped (${signal || code}).`);
    stopAll(code || 0);
  }
});

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));

function stopAll(exitCode) {
  if (isStopping) {
    return;
  }

  isStopping = true;
  kill(apiProcess);
  kill(angularProcess);
  process.exit(exitCode);
}

function kill(childProcess) {
  if (!childProcess.killed) {
    childProcess.kill();
  }
}
