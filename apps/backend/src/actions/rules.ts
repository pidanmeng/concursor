'use server'

import { headers } from 'next/headers'
import payloadConfig from '@/payload.config'
import { getPayload } from 'payload'
import type { Rule } from '@/payload-types'

export interface RulesData {
  docs: Rule[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export async function getUserRules(page: number = 1, limit: number = 10): Promise<RulesData> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })

    if (!user) {
      throw new Error('用户未认证')
    }

    const rules = await payload.find({
      collection: 'rules',
      limit,
      page,
      sort: '-updatedAt',
      where: {
        'creator.value': {
          equals: user.id,
        },
      },
    })

    return {
      docs: rules.docs as Rule[],
      totalDocs: rules.totalDocs,
      totalPages: rules.totalPages,
      page: rules.page || 1,
      hasNextPage: rules.hasNextPage,
      hasPrevPage: rules.hasPrevPage
    }
  } catch (error) {
    console.error('获取规则失败:', error)
    return {
      docs: [],
      totalDocs: 0,
      totalPages: 0,
      page: 1,
      hasNextPage: false,
      hasPrevPage: false
    }
  }
} 