import { useCommand } from 'reactive-vscode'
import { login } from './auth/login'
import * as Meta from './generated/meta'

export function useCommands() {
  useCommand(Meta.commands.login, async () => {
    login()
  })
}
