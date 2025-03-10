import { useTranslations } from 'next-intl'
import { ItemCard } from '@/components/dashboard/item-card'
import { ItemRow } from '@/components/dashboard/item-row'
import type { Project } from '@/payload-types'
import { AddProjectsDialog } from '@/components/dashboard/add-projects-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useSetAtom } from 'jotai'
import { recentProjectsAtom, statsAtom } from '../page.client'
import { useCallback } from 'react'
import { DashboardData } from '@/actions/dashboard'
import { RECENT_LIMIT } from '../constants/dashboard'

interface ProjectsCardProps {
  projects: Project[]
  icon: React.ReactNode
  onAddProject?: (project: Project) => void
  onViewAllProjects?: () => void
}

export function RecentProjectsCard({
  projects,
  icon,
  onViewAllProjects,
}: ProjectsCardProps) {
  const t = useTranslations('dashboard')
  const setRecentProjects = useSetAtom(recentProjectsAtom)
  const setStats = useSetAtom(statsAtom)
  const onSuccess = useCallback(
    (project: Project) => {
      setRecentProjects((prev) => [project, ...prev].slice(0, RECENT_LIMIT))
      setStats((prev: DashboardData['stats']) => ({
        ...prev,
        projects: { ...prev.projects, value: prev.projects.value + 1 },
      }))
    },
    [setRecentProjects, setStats],
  )
  return (
    <ItemCard
      title={t('recentProjects.title')}
      emptyText={t('recentProjects.empty')}
      viewAllText={t('recentProjects.viewAll')}
      onViewAllClick={onViewAllProjects}
      isEmpty={projects.length === 0}
      addButton={
        <AddProjectsDialog onSuccess={onSuccess}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('addProject.btn')}
          </Button>
        </AddProjectsDialog>
      }
    >
      {projects.map((project) => (
        <ItemRow
          key={project.id}
          id={project.id}
          title={project.title}
          description={project.description || t('noDescription')}
          updatedAt={project.updatedAt}
          icon={icon}
          updatedAtKey="recentProjects.updatedAt"
        />
      ))}
    </ItemCard>
  )
}
