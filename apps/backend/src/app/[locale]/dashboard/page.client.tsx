'use client'

import { DashboardData } from '@/actions/dashboard'
import { RecentProjectsCard } from '@/components/dashboard/recent-projects-card'
import { RecentRulesCard } from '@/components/dashboard/recent-rules-card'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Project, Rule } from '@/payload-types'
import { recentProjectsAtom, recentRulesAtom, statsAtom } from '@/states/dashboard'
import { Star, Settings, Folder } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { memo } from 'react'

interface DashboardContentProps {
  stats: DashboardData['stats']
  recentRules: Rule[]
  recentProjects: Project[]
}

/**
 * Dashboard客户端组件
 * 负责展示服务端获取的数据，并管理客户端状态
 */
export const DashboardContent = memo(function DashboardContent({ 
  stats: statsFromServer, 
  recentRules: recentRulesFromServer, 
  recentProjects: recentProjectsFromServer 
}: DashboardContentProps) {
  const t = useTranslations('dashboard')

  // 使用 useHydrateAtoms 一次性初始化所有 atom
  useHydrateAtoms([
    [statsAtom, statsFromServer],
    [recentRulesAtom, recentRulesFromServer],
    [recentProjectsAtom, recentProjectsFromServer]
  ])
  
  // 读取状态，不直接修改
  const stats = useAtomValue(statsAtom)
  const recentRules = useAtomValue(recentRulesAtom)
  const recentProjects = useAtomValue(recentProjectsAtom)

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <RecentRulesCard rules={recentRules} />
        <RecentProjectsCard projects={recentProjects} />
      </div>
    </>
  )
})
