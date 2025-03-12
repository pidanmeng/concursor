import type { Access } from 'payload'

export const notObsolete: Access = () => {
  return {
    obsolete: {
      equals: false,
    },
  }
}
