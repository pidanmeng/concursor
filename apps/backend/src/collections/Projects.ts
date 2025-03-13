import { adminUser } from '@/access/adminUser'
import { authenticated } from '@/access/authenticated'
import { isCreator } from '@/access/isCreator'
import { and, or } from '@/access/mergeAccess'
import { notObsolete } from '@/access/notObosolete'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { creator } from '@/fields/creator'
import { obsolete } from '@/fields/obsolete'
import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: COLLECTION_SLUGS.PROJECTS,
  access: {
    read: or([and([isCreator, notObsolete]), adminUser]),
    create: authenticated,
    update: or([isCreator, adminUser]),
    delete: adminUser,
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
    obsolete(),
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
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
