import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import type { CollectionConfig } from 'payload'

export const AdminUsers: CollectionConfig = {
  slug: COLLECTION_SLUGS.ADMIN_USERS,
  labels: {
    singular: '管理员',
    plural: '管理员',
  },
  admin: {
    useAsTitle: 'email',
    group: '用户数据',
  },
  auth: {
    useAPIKey: true,
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
  ],
}
