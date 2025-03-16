import type { User } from '../../../../apps/backend/src/payload-types'
import { fetchWithAuth } from '../utils/fetchWithAuth'

export const me = async (): Promise<{
  user: User
  message: string
}> => {
  const response = await fetchWithAuth(`/users/me`)
  return response
}
