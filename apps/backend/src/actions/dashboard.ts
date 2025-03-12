'use server'

import payloadConfig from '@/payload.config'
import { getPayload } from 'payload'
import type { Rule, Project } from '@/payload-types'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { RECENT_LIMIT } from '@/app/[locale]/dashboard/constants/dashboard'
import { getUser } from './auth'

interface StatsData {
  value: number
}

export interface DashboardData {
  stats: {
    rules: StatsData
    favorites: StatsData
    projects: StatsData
  }
  recentRules: Rule[]
  recentProjects: Project[]
}

export async function getDashboardOverview(): Promise<DashboardData> {
  const payload = await getPayload({ config: payloadConfig })
  const user = await getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const rules = await payload.find({
    collection: COLLECTION_SLUGS.RULES,
    limit: RECENT_LIMIT,
    sort: '-updatedAt',
    where: {
      'creator.value': {
        equals: user.id,
      },
    },
    overrideAccess: false,
    user,
  })

  const favorites = await payload.count({
    collection: COLLECTION_SLUGS.FAVORITES,
    where: {
      'creator.value': {
        equals: user.id,
      },
    },
    overrideAccess: false,
    user,
  })

  const projects = await payload.find({
    collection: COLLECTION_SLUGS.PROJECTS,
    limit: RECENT_LIMIT,
    sort: '-updatedAt',
    where: {
      'creator.value': {
        equals: user.id,
      },
    },
    overrideAccess: false,
    user,
  })

  return {
    stats: {
      rules: {
        value: rules.totalDocs,
      },
      favorites: {
        value: favorites.totalDocs,
      },
      projects: {
        value: projects.totalDocs,
      },
    },
    recentRules: rules.docs as Rule[],
    recentProjects: projects.docs as Project[],
  }
}


export async function createProject(
  data: Pick<Project, 'title' | 'description'> & { id?: string },
): Promise<Project> {
  const payload = await getPayload({ config: payloadConfig })
  const user = await getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }
  const project = await payload.create({
    collection: COLLECTION_SLUGS.PROJECTS,
    data: {
      ...data,
      creator: { value: user.id, relationTo: COLLECTION_SLUGS.USERS },
    },
    overrideAccess: false,
    user,
  })
  return project
}
