import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import type { CollectionConfig } from 'payload'

export const Favorites: CollectionConfig = {
  slug: COLLECTION_SLUGS.FAVORITES,
  labels: {
    singular: '收藏',
    plural: '收藏',
  },
  admin: {
    group: 'Cursor Rules',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: COLLECTION_SLUGS.USERS,
      required: true,
    },
    {
      name: 'rule',
      type: 'relationship', 
      relationTo: COLLECTION_SLUGS.RULES,
      required: true,
    }
  ],
} 