import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { isCreator } from '@/access/isCreator'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { creator } from '@/fields/creator'
import { BeforeSync } from '@payloadcms/plugin-search/types'
import type { CollectionConfig, Field } from 'payload'

export const baseRuleFields: Field[] = [
  creator(),

  {
    name: 'description',
    type: 'text',
    index: true,
  },
  {
    name: 'downloadCount',
    type: 'number',
    defaultValue: 0,
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
]

export const ruleBeforeSync: BeforeSync = function ({ searchDoc, originalDoc }) {
  return {
    ...searchDoc,
    creator: originalDoc.creator,
    tags: originalDoc.tags,
    private: originalDoc.private,
    description: originalDoc.description,
    downloadCount: originalDoc.downloadCount,
  }
}

export const Rules: CollectionConfig = {
  slug: COLLECTION_SLUGS.RULES,
  hooks: {
    beforeDelete: [
      async ({ req }) => {
        console.log(req.user?.id)
        return true
      },
    ],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: isCreator,
    delete: isCreator,
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
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
    },
    ...baseRuleFields,
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
      name: 'forkedFrom',
      type: 'relationship',
      relationTo: COLLECTION_SLUGS.RULES,
    },
  ],
}
