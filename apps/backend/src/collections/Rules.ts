import { adminUser } from '@/access/adminUser'
import { authenticated } from '@/access/authenticated'
import { isCreator } from '@/access/isCreator'
import { and, or } from '@/access/mergeAccess'
import { notObsolete } from '@/access/notObosolete'
import { notPrivate } from '@/access/notPrivate'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { creator } from '@/fields/creator'
import { obsolete } from '@/fields/obsolete'
import { privateField } from '@/fields/private'
import { BeforeSync } from '@payloadcms/plugin-search/types'
import type { CollectionConfig, Field } from 'payload'

export const baseRuleFields: Field[] = [
  creator(),
  obsolete(),
  {
    name: 'description',
    label: '描述',
    type: 'text',
    index: true,
  },
  {
    name: 'downloadCount',
    label: '下载量',
    type: 'number',
    defaultValue: 0,
  },
  {
    name: 'favoriteCount',
    label: '收藏量',
    type: 'number',
    defaultValue: 0,
  },
  {
    name: 'tags',
    label: '标签',
    type: 'relationship',
    relationTo: COLLECTION_SLUGS.TAGS,
    hasMany: true,
  },
]

export const ruleBeforeSync: BeforeSync = function ({ searchDoc, originalDoc }) {
  return {
    ...searchDoc,
    creator: originalDoc.creator,
    obsolete: originalDoc.obsolete,
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
    read: or([and([or([notPrivate, isCreator]), notObsolete]), adminUser]),
    create: authenticated,
    update: or([isCreator, adminUser]),
    delete: adminUser,
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
    content: true,
  },
  fields: [
    privateField(),
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
      label: '标题',
    },
    ...baseRuleFields,
    {
      name: 'globs',
      type: 'text',
      label: '匹配规则',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      index: true,
      label: '内容',
    },
    {
      name: 'forkedFrom',
      type: 'relationship',
      relationTo: COLLECTION_SLUGS.RULES,
      label: 'Forked From',
    },
  ],
}
