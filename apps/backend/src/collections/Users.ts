import { anyone } from '@/access/anyone'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: COLLECTION_SLUGS.USERS,
  access: {
    read: anyone,
    update: ({ req, data }) => {
      return req.user?.collection === 'admin-users' || req.user?.id === data?.id
    },
    delete: ({ req, data }) => {
      return req.user?.collection === 'admin-users' || req.user?.id === data?.id
    },
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
      on: 'user',
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
