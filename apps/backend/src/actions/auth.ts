import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { headers } from 'next/headers'

export async function getUser() {
  const payload = await getPayload({ config: payloadConfig })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })
  return user
}
