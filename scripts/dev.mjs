import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const viteEntry = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))
const backendMode = process.env.VITE_COMMON_PHRASE_BACKEND ?? 'fastapi'
const pythonEntry =
  process.env.AICC_PYTHON ??
  (process.platform === 'win32'
    ? 'backend/.venv/Scripts/python.exe'
    : 'backend/.venv/bin/python')
const backendProcess =
  backendMode === 'node'
    ? [
        process.execPath,
        ['--experimental-strip-types', 'server/index.ts'],
      ]
    : [pythonEntry, ['backend/run.py']]
const processes = [
  spawn(backendProcess[0], backendProcess[1], { stdio: 'inherit' }),
  spawn(process.execPath, [viteEntry], { stdio: 'inherit' }),
]

let isStopping = false

function stop(exitCode) {
  if (isStopping) {
    return
  }

  isStopping = true
  processes.forEach((child) => {
    if (!child.killed) {
      child.kill()
    }
  })
  process.exitCode = exitCode
}

processes.forEach((child) => {
  child.on('exit', (code) => {
    if (!isStopping) {
      stop(code ?? 1)
    }
  })
})

process.once('SIGINT', () => stop(0))
process.once('SIGTERM', () => stop(0))
