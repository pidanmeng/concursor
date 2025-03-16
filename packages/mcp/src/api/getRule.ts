
import type { Rule } from '../../../../apps/backend/src/payload-types'
import { fetchWithAuth } from '../utils/fetchWithAuth'

export const getRule = async (
  ruleId: string,
): Promise<Rule> => {
  const response = await fetchWithAuth(`/rules/${ruleId}`)
  return response
}
