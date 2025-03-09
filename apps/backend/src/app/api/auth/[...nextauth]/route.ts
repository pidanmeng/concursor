import NextAuth from 'next-auth'
import { withPayload } from 'payload-authjs'
import { authConfig } from '@/utils/auth'
import payloadConfig from '@/payload.config'

const { handlers } = NextAuth(withPayload(authConfig, {
  payloadConfig,
}))

export const { GET, POST } = handlers
