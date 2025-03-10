import type { Access } from 'payload'

export const isCreator: Access = ({ req: { user } }) => {
  if (!user) return false
  // if (user.collection === COLLECTION_SLUGS.ADMIN_USERS) return true
  return {
    'creator.value': {
      equals: user.id,
    },
  }
}
