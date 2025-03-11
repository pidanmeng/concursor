'use server'

import { headers } from 'next/headers'
import payloadConfig from '@/payload.config'
import { getPayload } from 'payload'
import type { Rule } from '@/payload-types'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'

export interface RulesData {
  docs: Rule[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface SearchParams {
  query?: string
  page?: number
  limit?: number
  sort?: string
}

// 获取用户规则列表
export async function getUserRules(
  page: number = 1, 
  limit: number = 10, 
  query: string = '',
  sort: string = '-updatedAt'
): Promise<RulesData> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })

    if (!user) {
      throw new Error('用户未认证')
    }

    // 构建查询条件
    const where: any = {
      'creator.value': {
        equals: user.id,
      },
    }

    // 如果有搜索关键字，添加标题搜索条件
    if (query) {
      where.title = {
        like: query,
      }
    }

    const rules = await payload.find({
      collection: COLLECTION_SLUGS.RULES,
      limit,
      page,
      sort,
      where,
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

// 删除规则
export async function deleteRule(ruleId: string): Promise<boolean> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })

    if (!user) {
      throw new Error('用户未认证')
    }

    // 先检查规则是否属于当前用户
    const rule = await payload.findByID({
      collection: COLLECTION_SLUGS.RULES,
      id: ruleId,
    })

    const creatorId = typeof rule.creator.value === 'string' 
      ? rule.creator.value 
      : (rule.creator.value as any).id

    if (creatorId !== user.id) {
      throw new Error('无权删除此规则')
    }

    await payload.delete({
      collection: COLLECTION_SLUGS.RULES,
      id: ruleId,
    })

    return true
  } catch (error) {
    console.error('删除规则失败:', error)
    throw error
  }
}

// 更新规则
export async function updateRule(
  ruleId: string,
  data: Partial<Pick<Rule, 'title' | 'content' | 'description' | 'globs' | 'private' | 'tags'>>
): Promise<Rule> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })

    if (!user) {
      throw new Error('用户未认证')
    }

    // 先检查规则是否属于当前用户
    const rule = await payload.findByID({
      collection: COLLECTION_SLUGS.RULES,
      id: ruleId,
    })

    const creatorId = typeof rule.creator.value === 'string' 
      ? rule.creator.value 
      : (rule.creator.value as any).id

    if (creatorId !== user.id) {
      throw new Error('无权修改此规则')
    }

    const updatedRule = await payload.update({
      collection: COLLECTION_SLUGS.RULES,
      id: ruleId,
      data,
    })

    return updatedRule as Rule
  } catch (error) {
    console.error('更新规则失败:', error)
    throw error
  }
}

// 切换规则可见性
export async function toggleRuleVisibility(ruleId: string): Promise<Rule> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })

    if (!user) {
      throw new Error('用户未认证')
    }

    // 先获取规则当前状态
    const rule = await payload.findByID({
      collection: COLLECTION_SLUGS.RULES,
      id: ruleId,
    }) as Rule

    const creatorId = typeof rule.creator.value === 'string' 
      ? rule.creator.value 
      : (rule.creator.value as any).id

    if (creatorId !== user.id) {
      throw new Error('无权修改此规则')
    }

    // 切换private状态
    const updatedRule = await payload.update({
      collection: COLLECTION_SLUGS.RULES,
      id: ruleId,
      data: {
        private: !rule.private,
      },
    })

    return updatedRule as Rule
  } catch (error) {
    console.error('切换规则可见性失败:', error)
    throw error
  }
}

// 获取单个规则详情
export async function getRule(ruleId: string): Promise<Rule> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })

    if (!user) {
      throw new Error('用户未认证')
    }

    const rule = await payload.findByID({
      collection: COLLECTION_SLUGS.RULES,
      id: ruleId,
    })

    return rule as Rule
  } catch (error) {
    console.error('获取规则详情失败:', error)
    throw error
  }
} 