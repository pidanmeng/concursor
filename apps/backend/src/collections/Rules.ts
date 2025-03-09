import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { creator } from '@/fields/creator'
import type { CollectionConfig } from 'payload'

export const Rules: CollectionConfig = {
  slug: COLLECTION_SLUGS.RULES,
  access: {
    read: anyone,
    create: authenticated,
    update: ({ req, data }) => {
      return (
        data?.creator?.relationTo === req.user?.collection && data?.creator?.value === req.user?.id
      )
    },
    delete: ({ req, data }) => {
      return (
        data?.creator?.relationTo === req.user?.collection && data?.creator?.value === req.user?.id
      )
    },
  },
  labels: {
    singular: 'Rule',
    plural: 'Rules',
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
      name: 'globs',
      type: 'text',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      index: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: COLLECTION_SLUGS.TAGS,
      hasMany: true,
    },
    {
      name: 'private',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'forkedFrom',
      type: 'relationship',
      relationTo: COLLECTION_SLUGS.RULES,
    },
    {
      name: 'downloadCount',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
