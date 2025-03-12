'use server'

import { getPayload } from 'payload'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import payloadConfig from '@/payload.config'
import { getUser } from './auth'

export async function searchTags(q: string) {
  if (!q) {
    return []
  }

  try {
    const user = await getUser()
    const payload = await getPayload({ config: payloadConfig })

    // 使用TagsSearch集合进行搜索
    const results = await payload.find({
      collection: COLLECTION_SLUGS.TAGS_SEARCH,
      where: {
        name: {
          contains: q,
        },
      },
      limit: 10,
      overrideAccess: false,
      user,
    })

    return results.docs
  } catch (error) {
    console.error('Error searching tags:', error)
    return []
  }
}

export async function createTag(name: string) {
  const user = await getUser()
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.create({
    collection: COLLECTION_SLUGS.TAGS,
    data: {
      name,
    },
    overrideAccess: false,
    user,
  })
  return result
}

