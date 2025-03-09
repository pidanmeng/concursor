import { getPayload } from '@concursor/api'

export async function getUserInfo() {
  const payload = getPayload()
  const users = await payload.auth({
    collection: 'users',
  })
  return users
}
