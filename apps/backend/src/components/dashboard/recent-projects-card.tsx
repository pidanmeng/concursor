'use client'

import { Project } from '@/payload-types'
import { useTranslations } from 'next-intl'
import { Folder, Plus } from 'lucide-react'
import { memo } from 'react'
import { GenericItemCard } from './generic-item-card'
import { ItemRow } from './item-row'
import { Button } from '@/components/ui/button'
import { Link, useRouter } from '@/i18n/routing'


export interface RecentProjectsCardProps {
  projects: Project[]
  onViewAllProjects?: () => void
}

export const RecentProjectsCard = memo(function RecentProjectsCard({
  projects,
  onViewAllProjects,
}: RecentProjectsCardProps) {
  const t = useTranslations('dashboard')
  const router = useRouter()
  // const setRecentProjects = useSetAtom(recentProjectsAtom)
  // const setStats = useSetAtom(statsAtom)

  // const onSuccess = useCallback(
  //   (project: Project) => {
  //     setRecentProjects((prev: Project[]) => [project, ...prev].slice(0, RECENT_LIMIT))
  //     setStats((prev: DashboardData['stats']) => ({
  //       ...prev,
  //       projects: { ...prev.projects, value: prev.projects.value + 1 },
  //     }))
  //   },
  //   [setRecentProjects, setStats],
  // )

  return (
    <GenericItemCard<Project>
      title={t('recentProjects.title')}
      emptyText={t('recentProjects.empty')}
      viewAllText={t('recentProjects.viewAll')}
      items={projects}
      onViewAllClick={onViewAllProjects}
      addButton={
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('addProject.btn')}
          </Link>
        </Button>
      }
      renderItem={(project) => (
        <ItemRow<Project>
          id={project.id}
          title={project.title}
          description={project.description || t('noDescription')}
          updatedAt={project.updatedAt}
          icon={<Folder className="text-primary h-5 w-5" />}
          item={project}
          translationPrefix="dashboard.recentProjects"
          onItemClick={() => {
            router.push(`/dashboard/projects/${project.id}`)
          }}
        />
      )}
    />
  )
})
