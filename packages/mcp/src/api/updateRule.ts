import type { Rule } from '../../../../apps/backend/src/payload-types'
import { fetchWithAuth } from '../utils/fetchWithAuth'

export const updateRule = async (
  ruleId: string,
  content: string,
): Promise<{
  doc: Rule
  message: string
}> => {
  const response = await fetchWithAuth(`/rules/${ruleId}`, {
    method: 'PATCH',
    body: JSON.stringify({ content }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response
}
