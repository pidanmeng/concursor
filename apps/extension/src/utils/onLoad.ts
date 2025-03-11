import { getPayload } from '@concursor/api'
import { login } from '../auth/login'
import { getBaseUrl } from './getBaseUrl'

export async function onLoad() {
  const payload = getPayload()
  payload.setBaseUrl(getBaseUrl())

  login()
}
