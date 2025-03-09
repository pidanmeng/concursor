import { extensionContext } from 'reactive-vscode'
import { ExtensionMode } from 'vscode'

export function getEnv() {
  return extensionContext.value?.extensionMode === ExtensionMode.Development
    ? 'dev'
    : 'prod'
}
