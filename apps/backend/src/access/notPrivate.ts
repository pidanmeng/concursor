import type { Access } from 'payload'

export const notPrivate: Access = () => {
  return {
    private: {
      equals: false,
    },
  }
}
