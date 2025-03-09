import { getPayload } from '@concursor/api'
import { l10n, window } from 'vscode'
import { getUserInfo } from '../auth/getUserInfo'
import { getBaseUrl } from './getBaseUrl'
import { logger } from './logger'

export async function onLoad() {
  getPayload(getBaseUrl())
  const { t } = l10n

  const action = await window.showInformationMessage(
    t('Login to Concursor to start managing your cursor rules'),
    t('Login'),
  )
  if (action === t('Login')) {
    const users = await getUserInfo()
    logger.info(JSON.stringify(users, null, 2))
  }
}
