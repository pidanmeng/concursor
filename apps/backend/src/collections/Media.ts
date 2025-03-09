import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: COLLECTION_SLUGS.MEDIA,
  labels: {
    singular: '媒体',
    plural: '媒体',
  },
  admin: {
    group: '全局设置',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
