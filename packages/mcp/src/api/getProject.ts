import type { Project } from '../../../../apps/backend/src/payload-types'
import { fetchWithAuth } from '../utils/fetchWithAuth'

export const getProject = async (
  projectId: string,
): Promise<Project> => {
  const response = await fetchWithAuth(`/projects/${projectId}`)
  return response
}
