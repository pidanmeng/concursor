import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { translator, copyResolver, googleResolver } from '@payload-enchants/translator'
import { s3Storage } from '@payloadcms/storage-s3'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { authjsPlugin } from 'payload-authjs'
import { authConfig } from '@/utils/auth'
import { authFixPlugin } from './authFix'

export const plugins: Plugin[] = [
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      admin: {
        group: '全局设置',
      },
      labels: {
        singular: '表单',
        plural: '表单',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      admin: {
        group: '用户数据',
      },
      labels: {
        singular: '表单提交',
        plural: '表单提交',
      },
    },
  }),
  payloadCloudPlugin(),
  searchPlugin({
    collections: [COLLECTION_SLUGS.RULES],
    searchOverrides: {
      slug: 'rule-search',
      admin: {
        group: '搜索结果',
      },
      labels: {
        singular: 'Rules搜索',
        plural: 'Rules搜索',
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields]
      },
    },
  }),
  translator({
    collections: [],
    globals: [],
    resolvers: [
      copyResolver(),
      googleResolver({
        apiKey: process.env.GOOGLE_API_KEY!,
      }),
    ],
  }),
  s3Storage({
    collections: {
      [COLLECTION_SLUGS.MEDIA]: true,
    },
    bucket: process.env.S3_BUCKET || '',
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      region: process.env.S3_REGION || '',
    },
  }),
  authjsPlugin({
    authjsConfig: authConfig,
  }),
  authFixPlugin(),
]
