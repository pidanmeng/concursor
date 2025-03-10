'use server'

import { headers } from 'next/headers'
import payloadConfig from '@/payload.config'
import { getPayload } from 'payload'
import type { Rule, Project } from '@/payload-types'

interface StatsData {
  value: number
  change: number
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
    limit: 5,
    sort: '-updatedAt',
    where: {
      'creator.value': {
        equals: user.id,
      },
    },
  })

  const favorites = await payload.find({
    collection: 'favorites',
    where: {
      'creator.value': {
        equals: user.id,
      },
    },
  })

  const projects = await payload.find({
    collection: 'projects',
    limit: 5,
    sort: '-updatedAt',
    where: {
      'creator.value': {
        equals: user.id,
      },
    },
  })

  // 模拟月度变化数据
  const rulesChange = rules.totalDocs > 0 ? Math.floor(rules.totalDocs * 0.2) : 0
  const favoritesChange = favorites.totalDocs > 0 ? Math.floor(favorites.totalDocs * 0.3) : 0
  const projectsChange = projects.totalDocs > 0 ? Math.floor(projects.totalDocs * 0.1) : 0

  return {
    stats: {
      rules: {
        value: rules.totalDocs,
        change: rulesChange,
      },
      favorites: {
        value: favorites.totalDocs,
        change: favoritesChange,
      },
      projects: {
        value: projects.totalDocs,
        change: projectsChange,
      },
    },
    recentRules: rules.docs as Rule[],
    recentProjects: projects.docs as Project[],
  }
}
