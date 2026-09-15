import { spawnSync } from 'node:child_process';
import process from 'node:process';
import { existsSync } from 'node:fs';

const pythonPath = process.platform === 'win32'
  ? 'backend/.venv/Scripts/python.exe'
  : 'backend/.venv/bin/python';
const executable = existsSync(pythonPath) ? pythonPath : 'python';
const result = spawnSync(executable, process.argv.slice(2), {
  stdio: 'inherit',
  shell: false,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
