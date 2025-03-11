import { getPayload } from '@concursor/api'
import { env, l10n, Uri, window, workspace } from 'vscode'
import { port } from '../server'
import { logger } from '../utils'
import { getApiBaseUrl, getBaseUrl } from '../utils/getBaseUrl'
import { currentUser } from './currentUser'
import { getUserInfo } from './getUserInfo'
import { getApiKeyFromSecretStorage, saveApiKey } from './storage'

interface LoginOptions {
  newApiKey?: string
  silent?: boolean
}

// ensure api key and currentUser both exist
export async function login(options: LoginOptions = {}) {
  const { newApiKey, silent } = options
  if (newApiKey) {
    await saveApiKey(newApiKey)
  }
  if (currentUser.value?.id) {
    return
  }
  const apiKey = newApiKey ?? (await getApiKeyFromSecretStorage())
  if (apiKey) {
    const payload = getPayload()
    payload.setBaseUrl(getApiBaseUrl())
    payload.setApiKey(apiKey ?? '')

    if (apiKey) {
      const user = await getUserInfo()
      currentUser.value = user
    }
    return
  }

  if (silent) {
    throw new Error('Login failed')
  }

  const { t } = l10n

  const action = await window.showInformationMessage(
    t('Login to Concursor to start managing your cursor rules'),
    t('Login'),
  )
  if (action === t('Login')) {
    const filePath
      = window.activeTextEditor?.document.uri.fsPath
        || workspace.workspaceFolders?.[0]?.uri.fsPath
    const url = `${getBaseUrl()}/signin?source=extension&port=${
      port.value
    }&filePath=${filePath}`
    logger.info(`Opening ${url}`)
    try {
      env.openExternal(Uri.parse(url))
    }
    catch (error) {
      logger.error(error)
      window.showErrorMessage('Failed to open browser')
    }
  }
}
