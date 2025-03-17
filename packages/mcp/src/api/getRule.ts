
import type { Rule } from '../../../../apps/backend/src/payload-types'
import { fetchWithAuth } from '../utils/fetchWithAuth'

export const getRule = async (
  ruleId: string,
): Promise<Rule> => {
  const response = await fetchWithAuth(`/rules/${ruleId}`)
  return response
}

export const getOwnedRules = async (): Promise<{
  docs: Rule[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}> => {
  const response = await fetchWithAuth('/rules/owned')
  return response
}
