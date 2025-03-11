import { getPayload } from '@concursor/api'
import { login } from '../auth/login'
import { getApiBaseUrl } from './getBaseUrl'

//  todo:修改逻辑
export async function onLoad() {
  const payload = getPayload()
  payload.setBaseUrl(getApiBaseUrl())

  login()
}
