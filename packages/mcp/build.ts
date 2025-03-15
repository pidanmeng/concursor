import { spawn } from 'bun'
import chokidar from 'chokidar'

const watcher = chokidar.watch(['./index.ts', 'src'])

function build() {
  spawn(['bun', 'run', 'build'])
}

watcher.on('change', async (event, path) => {
  console.log(`File ${path} has been ${event}`)
  build()
})

build()
