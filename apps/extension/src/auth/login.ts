import { env, Uri, window, workspace } from 'vscode'
import { port } from '../server'
import { logger } from '../utils'
import { getBaseUrl } from '../utils/getBaseUrl'

export async function login() {
  const filePath = window.activeTextEditor?.document.uri.fsPath || workspace.workspaceFolders?.[0]?.uri.fsPath
  const url = `${getBaseUrl()}/signin?source=extension&port=${port.value}&filePath=${filePath}`
  logger.info(`Opening ${url}`)
  try {
    env.openExternal(Uri.parse(url))
  }
  catch (error) {
    logger.error(error)
    window.showErrorMessage('Failed to open browser')
  }
}
