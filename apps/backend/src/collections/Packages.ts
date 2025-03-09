import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { creator } from '@/fields/creator'
import type { CollectionConfig } from 'payload'

export const Packages: CollectionConfig = {
  slug: COLLECTION_SLUGS.PACKAGES,
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  labels: {
    singular: '集合',
    plural: '集合',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Cursor Rules',
  },
  fields: [
    creator(),
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'rules',
      type: 'relationship',
      relationTo: COLLECTION_SLUGS.RULES,
      hasMany: true,
    },
    {
      name: 'private',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: COLLECTION_SLUGS.TAGS,
      hasMany: true,
    },
  ],
}
