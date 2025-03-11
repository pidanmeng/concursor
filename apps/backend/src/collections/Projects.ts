import { adminUser } from '@/access/adminUser'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { isCreator } from '@/access/isCreator'
import { or } from '@/access/mergeAccess'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { creator } from '@/fields/creator'
import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: COLLECTION_SLUGS.PROJECTS,
  access: {
    read: anyone,
    create: authenticated,
    update: or([isCreator, adminUser]),
    delete: or([isCreator, adminUser]),
  },
  labels: {
    singular: '项目',
    plural: '项目',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Cursor Rules',
  },
  fields: [
    creator(),
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'description',
      type: 'text',
      index: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: COLLECTION_SLUGS.TAGS,
      hasMany: true,
    },
    {
      name: 'rules',
      type: 'array',
      fields: [
        {
          name: 'rule',
          type: 'relationship',
          relationTo: COLLECTION_SLUGS.RULES,
        },
        {
          name: 'alias',
          type: 'text',
        },
      ],
    },
  ],
}
