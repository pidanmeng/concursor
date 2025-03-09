import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { zh } from '@payloadcms/translations/languages/zh'
import { en } from '@payloadcms/translations/languages/en'

import { getServerSideURL } from '@concursor/utils'
import { collections } from './collections'
import { AdminUsers } from './collections/AdminUsers'
import { plugins } from '../plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = buildConfig({
  i18n: {
    fallbackLanguage: 'zh',
    supportedLanguages: {
      en,
      zh,
    },
  },
  localization: {
    locales: ['en', 'zh'], // required
    defaultLocale: 'en', // required
  },
  admin: {
    user: AdminUsers.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  cors: [getServerSideURL(), 'http://localhost:3000'].filter(Boolean),
  collections,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins,
  email: resendAdapter({
    apiKey: process.env.RESEND_API_KEY || '',
    defaultFromAddress: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL || '',
    defaultFromName: process.env.NEXT_PUBLIC_RESEND_FROM_NAME || '',
  }),
})

export default config
