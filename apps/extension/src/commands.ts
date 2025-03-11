import { useCommand } from 'reactive-vscode'
import { login } from './auth/login'
import { initConcursor } from './logic/init'
import * as Meta from './generated/meta'

export function useCommands() {
  useCommand(Meta.commands.login, async () => {
    login()
  })
  
  useCommand(Meta.commands.init, async () => {
    initConcursor()
  })
}
