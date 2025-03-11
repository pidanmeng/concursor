import { adminUser } from '@/access/adminUser'
import { authenticated } from '@/access/authenticated'
import { isCreator } from '@/access/isCreator'
import { and, or } from '@/access/mergeAccess'
import { notPrivate } from '@/access/notPrivate'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { creator } from '@/fields/creator'
import { privateField } from '@/fields/private'
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
    name: 'favoriteCount',
    type: 'number',
    defaultValue: 0,
  },
  {
    name: 'tags',
    type: 'relationship',
    relationTo: COLLECTION_SLUGS.TAGS,
    hasMany: true,
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
    favoriteCount: originalDoc.favoriteCount,
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
    read: or([notPrivate, adminUser]),
    create: authenticated,
    update: or([and([isCreator, notPrivate]), adminUser]),
    delete: or([and([isCreator, notPrivate]), adminUser]),
  },
  labels: {
    singular: 'Rule',
    plural: 'Rules',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Cursor Rules',
  },
  defaultPopulate: {
    title: true,
    tags: true,
    description: true,
    downloadCount: true,
    creator: true,
  },
  fields: [
    privateField(),
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
