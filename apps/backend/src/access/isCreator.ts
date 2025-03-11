import type { Access } from 'payload'

export const isCreator: Access = ({ req: { user } }) => {
  if (!user) return false
  return {
    'creator.value': {
      equals: user.id,
    },
  }
}
