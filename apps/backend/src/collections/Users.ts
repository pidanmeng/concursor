import { adminUser } from '@/access/adminUser'
import { anyone } from '@/access/anyone'
import { or } from '@/access/mergeAccess'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: COLLECTION_SLUGS.USERS,
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.apiKey) {
          return {
            ...data,
            apiKey: crypto.randomUUID(),
            enableAPIKey: true,
          }
        }
        return data
      },
    ],
  },
  access: {
    read: anyone,
    update: or([
      ({ req }) => {
        return {
          id: {
            equals: req.user?.id,
          },
        }
      },
      adminUser,
    ]),
    delete: or([
      ({ req }) => {
        return {
          id: {
            equals: req.user?.id,
          },
        }
      },
      adminUser,
    ]),
    create: anyone,
  },
  labels: {
    singular: '用户',
    plural: '用户',
  },
  admin: {
    useAsTitle: 'email',
    group: '用户数据',
  },
  auth: {
    useAPIKey: true,
  },
  custom: {
    enableLocalStrategy: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: '昵称',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: COLLECTION_SLUGS.MEDIA,
      label: '头像',
    },
    {
      name: 'personalPage',
      type: 'text',
      label: '个人主页',
    },
    {
      name: 'createdRules',
      type: 'join',
      collection: COLLECTION_SLUGS.RULES,
      on: 'creator',
      hasMany: true,
      label: '创建的规则',
    },
    {
      name: 'favoriteRules',
      type: 'join',
      collection: COLLECTION_SLUGS.FAVORITES,
      on: 'creator',
      hasMany: true,
      label: '收藏的规则',
    },
    {
      name: 'createdPackages',
      type: 'join',
      collection: COLLECTION_SLUGS.PACKAGES,
      on: 'creator',
      hasMany: true,
      label: '创建的集合',
    },
  ],
}
