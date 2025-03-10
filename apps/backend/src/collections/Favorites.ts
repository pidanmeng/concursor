import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { isCreator } from '@/access/isCreator'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { creator } from '@/fields/creator'
import type { CollectionConfig } from 'payload'

export const Favorites: CollectionConfig = {
  slug: COLLECTION_SLUGS.FAVORITES,
  labels: {
    singular: '收藏',
    plural: '收藏',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: isCreator,
    delete: isCreator,
  },
  admin: {
    group: 'Cursor Rules',
  },
  fields: [
    creator(),
    {
      name: 'rule',
      type: 'relationship', 
      relationTo: COLLECTION_SLUGS.RULES,
      required: true,
    }
  ],
} 