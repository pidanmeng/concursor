'use server'

import payloadConfig from '@/payload.config'
import { getPayload, Where } from 'payload'
import type { Rule } from '@/payload-types'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { getUser } from './auth'
import { getCodeMessage } from '@/constants/errorCode'

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

export async function getRules(
  page: number = 1,
  limit: number = 10,
  query: string = '',
  sort: string = '-updatedAt',
): Promise<RulesData> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const user = await getUser()

    if (!user) {
      throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
    }

    // 构建查询条件
    const where: Where = {}

    // 如果有搜索关键字，添加标题搜索条件
    if (query) {
      where.or = [
        {
          title: {
            like: query,
          },
        },
        {
          'tags.name': {
            like: query,
          },
        },
        {
          description: {
            like: query,
          },
        },
      ]
    }

    const rules = await payload.find({
      collection: COLLECTION_SLUGS.RULES,
      limit,
      page,
      sort,
      where,
      overrideAccess: false,
      user,
    })

    return {
      docs: rules.docs as Rule[],
      totalDocs: rules.totalDocs,
      totalPages: rules.totalPages,
      page: rules.page || 1,
      hasNextPage: rules.hasNextPage,
      hasPrevPage: rules.hasPrevPage,
    }
  } catch (error) {
    console.error('获取规则失败:', error)
    return {
      docs: [],
      totalDocs: 0,
      totalPages: 0,
      page: 1,
      hasNextPage: false,
      hasPrevPage: false,
    }
  }
}

// 获取用户规则列表
export async function getUserRules(
  page: number = 1,
  limit: number = 10,
  query: string = '',
  sort: string = '-updatedAt',
): Promise<RulesData> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const user = await getUser()

    if (!user) {
      throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
    }

    // 构建查询条件
    const where: Where = {
      'creator.value': {
        equals: user.id,
      },
    }

    // 如果有搜索关键字，添加标题搜索条件
    if (query) {
      where.or = [
        {
          title: {
            like: query,
          },
        },
        {
          'tags.name': {
            like: query,
          },
        },
        {
          description: {
            like: query,
          },
        },
      ]
    }

    const rules = await payload.find({
      collection: COLLECTION_SLUGS.RULES,
      limit,
      page,
      sort,
      where,
      overrideAccess: false,
      user,
    })

    return {
      docs: rules.docs as Rule[],
      totalDocs: rules.totalDocs,
      totalPages: rules.totalPages,
      page: rules.page || 1,
      hasNextPage: rules.hasNextPage,
      hasPrevPage: rules.hasPrevPage,
    }
  } catch (error) {
    console.error('获取规则失败:', error)
    return {
      docs: [],
      totalDocs: 0,
      totalPages: 0,
      page: 1,
      hasNextPage: false,
      hasPrevPage: false,
    }
  }
}

// 删除规则
export async function deleteRule(
  ruleId: string,
  { restore = false }: { restore?: boolean } = {},
): Promise<Rule> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const user = await getUser()

    if (!user) {
      throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
    }

    const rule = await payload.update({
      collection: COLLECTION_SLUGS.RULES,
      id: ruleId,
      data: {
        obsolete: restore ? false : true,
      },
      overrideAccess: false,
      user,
    })

    return rule
  } catch (error) {
    console.error('删除规则失败:', error)
    throw error
  }
}

// 更新规则
export async function updateRule(
  ruleId: string,
  data: Partial<
    Pick<Rule, 'title' | 'content' | 'description' | 'globs' | 'private' | 'tags' | 'obsolete'>
  >,
): Promise<Rule> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const user = await getUser()

    if (!user) {
      throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
    }

    const updatedRule = await payload.update({
      collection: COLLECTION_SLUGS.RULES,
      id: ruleId,
      data,
      overrideAccess: false,
      user,
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
    const user = await getUser()

    if (!user) {
      throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
    }

    // 先获取规则当前状态
    const rule = (await payload.findByID({
      collection: COLLECTION_SLUGS.RULES,
      id: ruleId,
      overrideAccess: false,
      user,
      select: {
        private: true,
      },
    })) as Rule

    // 切换private状态
    const updatedRule = await payload.update({
      collection: COLLECTION_SLUGS.RULES,
      id: ruleId,
      data: {
        private: !rule.private,
      },
      overrideAccess: false,
      user,
    })

    return updatedRule as Rule
  } catch (error) {
    console.error('切换规则可见性失败:', error)
    throw error
  }
}

// 获取单个规则详情
export async function getRule(ruleId: string): Promise<Rule | null> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const user = await getUser()

    if (!user) {
      throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
    }

    const rule = await payload.findByID({
      collection: COLLECTION_SLUGS.RULES,
      id: ruleId,
      overrideAccess: false,
      user,
    })

    return rule as Rule
  } catch (error) {
    console.error('获取规则详情失败:', error)
    return null
  }
}

export async function createRule(
  data: Pick<Rule, 'title' | 'content' | 'description' | 'globs' | 'private'> & { id?: string },
) {
  const payload = await getPayload({ config: payloadConfig })
  const user = await getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }
  const rule = await payload.create({
    collection: COLLECTION_SLUGS.RULES,
    data,
    overrideAccess: false,
    user,
  })
  return rule
}

// 批量更新规则
export async function batchUpdateRules(
  where: Where,
  data: Partial<Pick<Rule, 'private' | 'obsolete'>>,
): Promise<{
  docs: Rule[]
  errors: { id: string; message: string }[]
}> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const user = await getUser()

    if (!user) {
      throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
    }

    const result = await payload.update({
      collection: COLLECTION_SLUGS.RULES,
      where,
      data,
      overrideAccess: false,
      user,
    })

    return {
      docs: result.docs as Rule[],
      errors:
        result.errors?.map((error) => ({
          id: error.id as string,
          message: error.message,
        })) || [],
    }
  } catch (error) {
    console.error('批量更新规则失败:', error)
    throw error
  }
}

// 批量删除规则（软删除）
export async function batchDeleteRules(
  ruleIds: string[],
  { restore = false }: { restore?: boolean } = {},
): Promise<{
  docs: Rule[]
  errors: { id: string; message: string }[]
}> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const user = await getUser()

    if (!user) {
      throw new Error(getCodeMessage('USER_NOT_AUTHENTICATED'))
    }

    const result = await payload.update({
      collection: COLLECTION_SLUGS.RULES,
      where: {
        id: {
          in: ruleIds,
        },
      },
      data: {
        obsolete: restore ? false : true,
      },
      overrideAccess: false,
      user,
    })

    return {
      docs: result.docs as Rule[],
      errors:
        result.errors?.map((error) => ({
          id: error.id as string,
          message: error.message,
        })) || [],
    }
  } catch (error) {
    console.error('批量删除规则失败:', error)
    throw error
  }
}
