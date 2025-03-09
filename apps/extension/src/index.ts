import { defineExtension } from 'reactive-vscode'
import { useCommands } from './commands'
import { startServer } from './server'
import { onLoad } from './utils/onLoad'

const { activate, deactivate } = defineExtension(async () => {
  onLoad()

  useCommands()
})
startServer()

export { activate, deactivate }
