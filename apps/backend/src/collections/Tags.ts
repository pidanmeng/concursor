import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'
import { adminUser } from '@/access/adminUser'

export const Tags: CollectionConfig = {
  access: {
    read: anyone,
    create: authenticated,
    update: adminUser,
    delete: adminUser,
  },
  slug: COLLECTION_SLUGS.TAGS,
  labels: {
    singular: 'Tag',
    plural: 'Tags',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Cursor Rules',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: '名称',
      index: true,
    },
    {
      name: 'rules',
      type: 'join',
      collection: COLLECTION_SLUGS.RULES,
      on: 'tags',
      hasMany: true,
      label: '关联的规则',
    },
    {
      name: 'packages',
      type: 'join',
      collection: COLLECTION_SLUGS.PACKAGES,
      on: 'tags',
      hasMany: true,
      label: '关联的集合',
    },
  ],
}
