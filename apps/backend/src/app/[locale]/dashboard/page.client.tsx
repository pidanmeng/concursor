'use client'

import { StatsCard } from '@/components/dashboard/stats-card'
import { RecentRulesCard } from './components/recent-rules-card'
import { RecentProjectsCard } from './components/recent-projects-card'
import { useTranslations } from 'next-intl'
import type { Rule, Project } from '@/payload-types'
import { Settings, Folder, Star } from 'lucide-react'
import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { DashboardData } from '@/actions/dashboard'

export const recentRulesAtom = atom<Rule[]>([])
export const recentProjectsAtom = atom<Project[]>([])
export const statsAtom = atom<DashboardData['stats']>({
  rules: { value: 0 },
  favorites: { value: 0 },
  projects: { value: 0 },
})


interface DashboardContentProps {
  stats: DashboardData['stats']
  recentRules: Rule[]
  recentProjects: Project[]
}

export function DashboardContent({ stats: statsFromServer, recentRules: recentRulesFromServer, recentProjects: recentProjectsFromServer }: DashboardContentProps) {
  const t = useTranslations('dashboard')

  useHydrateAtoms([
    [recentRulesAtom, recentRulesFromServer],
    [recentProjectsAtom, recentProjectsFromServer],
    [statsAtom, statsFromServer],
  ])

  const stats = useAtomValue(statsAtom)
  const recentRules = useAtomValue(recentRulesAtom)
  const recentProjects = useAtomValue(recentProjectsAtom)

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title={t('stats.rules.title')}
          description={t('stats.rules.description')}
          value={stats.rules.value}
          icon={<Settings className="h-full" />}
        />

        <StatsCard
          title={t('stats.favorites.title')}
          description={t('stats.favorites.description')}
          value={stats.favorites.value}
          icon={<Star className="h-full" />}
        />

        <StatsCard
          title={t('stats.projects.title')}
          description={t('stats.projects.description')}
          value={stats.projects.value}
          icon={<Folder className="h-full" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <RecentRulesCard rules={recentRules} icon={<Settings className="text-primary h-5 w-5" />} />

        <RecentProjectsCard
          projects={recentProjects}
          icon={<Folder className="text-primary h-5 w-5" />}
        />
      </div>
    </>
  )
}
