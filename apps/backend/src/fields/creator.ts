import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import type { Field } from 'payload'
import { deepMerge } from '@concursor/utils'

export function creator({ override }: { override?: Partial<Field> } = {}): Field {
  const defaultConfig: Field = {
    admin: {
      position: 'sidebar',
      readOnly: true,
    },
    name: 'creator',
    index: true,
    type: 'relationship',
    relationTo: [COLLECTION_SLUGS.USERS, COLLECTION_SLUGS.ADMIN_USERS],
    label: '创建者',
    hooks: {
      beforeChange: [
        async ({ req, value }) => {
          if (!value && req.user) {
            return {
              relationTo: req.user.collection,
              value: req.user.id,
            }
          }
          return value
        },
      ],
    },
  }
  return deepMerge(defaultConfig, override)
}
