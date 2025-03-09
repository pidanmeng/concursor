import type { Plugin } from 'payload'
export const authFixPlugin = (): Plugin => {
  return (incomingConfig) => {
    const config = { ...incomingConfig }
    config.collections = config.collections ?? []
    const usersCollection = config.collections.find((c) => c.slug === 'users')
    if (usersCollection) {
      const originalAuth = typeof usersCollection.auth === 'object' ? usersCollection.auth : {}
      usersCollection.auth = {
        ...originalAuth,
        disableLocalStrategy: undefined,
        useAPIKey: true,
      }
      usersCollection.fields.push({
        name: 'apiKey',
        type: 'text',
        access: {
          read: ({ req, data }) => {
            return req.user?.id === data?.id
          },
        },
      })
    }
    return config
  }
}
