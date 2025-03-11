import type { User } from '../../../backend/src/payload-types'
import { getPayload } from '@concursor/api'

export async function getUserInfo(): Promise<User> {
  const payload = getPayload()
  const users = await payload.auth({
    collection: 'users',
  })
  return users as User
}
