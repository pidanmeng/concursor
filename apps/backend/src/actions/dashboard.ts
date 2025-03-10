'use server'

import { headers } from 'next/headers'
import payloadConfig from '@/payload.config'
import { getPayload } from 'payload'
import type { Rule, Project } from '@/payload-types'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'
import { RECENT_LIMIT } from '@/app/[locale]/dashboard/constants/dashboard'

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

  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    throw new Error('User not authenticated')
  }

  const rules = await payload.find({
    collection: 'rules',
    limit: RECENT_LIMIT,
    sort: '-updatedAt',
    where: {
      'creator.value': {
        equals: user.id,
      },
    },
  })

  const favorites = await payload.count({
    collection: 'favorites',
    where: {
      'creator.value': {
        equals: user.id,
      },
    },
  })

  const projects = await payload.find({
    collection: 'projects',
    limit: RECENT_LIMIT,
    sort: '-updatedAt',
    where: {
      'creator.value': {
        equals: user.id,
      },
    },
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

export async function createRule(
  data: Pick<Rule, 'title' | 'content' | 'description' | 'globs' | 'private'> & { id?: string },
) {
  const payload = await getPayload({ config: payloadConfig })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })
  if (!user) {
    throw new Error('User not authenticated')
  }
  const rule = await payload.create({
    collection: 'rules',
    data: {
      ...data,
      creator: { value: user.id, relationTo: COLLECTION_SLUGS.USERS },
    },
  })
  return rule
}

export async function createProject(
  data: Pick<Project, 'title' | 'description'> & { id?: string },
): Promise<Project> {
  const payload = await getPayload({ config: payloadConfig })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })
  if (!user) {
    throw new Error('User not authenticated')
  }
  const project = await payload.create({
    collection: 'projects',
    data: {
      ...data,
      creator: { value: user.id, relationTo: COLLECTION_SLUGS.USERS },
    },
  })
  return project
}
