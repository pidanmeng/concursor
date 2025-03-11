import { Project } from '@/payload-types'
import { useTranslations } from 'next-intl'
import { Folder, Plus } from 'lucide-react'
import { memo, useCallback } from 'react'
import { GenericItemCard } from './generic-item-card'
import { ItemRow } from './item-row'
import { DashboardData } from '@/actions/dashboard'
import { AddProjectsSheet } from './add-projects-sheet'
import { Button } from '@/components/ui/button'
import { useSetAtom } from 'jotai'
import { recentProjectsAtom, statsAtom } from '@/states/dashboard'

const RECENT_LIMIT = 5

export interface RecentProjectsCardProps {
  projects: Project[]
  onViewAllProjects?: () => void
}

export const RecentProjectsCard = memo(function RecentProjectsCard({ 
  projects, 
  onViewAllProjects 
}: RecentProjectsCardProps) {
  const t = useTranslations('dashboard')
  const setRecentProjects = useSetAtom(recentProjectsAtom)
  const setStats = useSetAtom(statsAtom)
  
  const onSuccess = useCallback(
    (project: Project) => {
      setRecentProjects((prev: Project[]) => [project, ...prev].slice(0, RECENT_LIMIT))
      setStats((prev: DashboardData['stats']) => ({
        ...prev,
        projects: { ...prev.projects, value: prev.projects.value + 1 },
      }))
    },
    [setRecentProjects, setStats],
  )

  return (
    <GenericItemCard<Project>
      title={t('recentProjects.title')}
      emptyText={t('recentProjects.empty')}
      viewAllText={t('recentProjects.viewAll')}
      items={projects}
      onViewAllClick={onViewAllProjects}
      addButton={
        <AddProjectsSheet onSuccess={onSuccess}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('addProject.btn')}
          </Button>
        </AddProjectsSheet>
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
        />
      )}
    />
  )
}) 