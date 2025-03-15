import { spawn } from 'bun'
import chokidar from 'chokidar'

const watcher = chokidar.watch(['./index.ts', 'src'])

function build() {
  spawn(['bun', 'run', 'build'])
}

function launchMCPDebugger() {
  // 将子进程的输出直接继承到当前进程
  spawn(['npx', '@modelcontextprotocol/inspector', 'node', 'dist/index.js'], {
    stdio: ['inherit', 'inherit', 'inherit']
  })
}

watcher.on('change', async (event, path) => {
  console.log(`File ${path} has been ${event}`)
  build()
})

launchMCPDebugger()

build()
