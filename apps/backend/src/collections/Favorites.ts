import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { isCreator } from '@/access/isCreator'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { creator } from '@/fields/creator'
import type { CollectionConfig, Field } from 'payload'
import type { BeforeSync } from '@payloadcms/plugin-search/types'
import { or } from '@/access/mergeAccess'
import { adminUser } from '@/access/adminUser'

export const baseFavoriteFields: Field[] = [
  creator(),
  {
    name: 'rule',
    type: 'relationship',
    relationTo: COLLECTION_SLUGS.RULES,
    required: true,
  },
]

export const favoriteBeforeSync: BeforeSync = function ({ searchDoc, originalDoc }) {
  return {
    ...searchDoc,
    rule: originalDoc.rule,
    creator: originalDoc.creator,
  }
}

export const Favorites: CollectionConfig = {
  slug: COLLECTION_SLUGS.FAVORITES,
  labels: {
    singular: '收藏',
    plural: '收藏',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: or([isCreator, adminUser]),
    delete: or([isCreator, adminUser]),
  },
  admin: {
    group: 'Cursor Rules',
  },
  fields: [...baseFavoriteFields],
}
