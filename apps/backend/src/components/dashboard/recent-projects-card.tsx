import { useTranslations } from "next-intl"
import { ItemCard } from "./item-card"
import { ItemRow } from "./item-row"
import type { Project } from "@/payload-types"

interface ProjectsCardProps {
  projects: Project[]
  icon: React.ReactNode
  onAddProject?: () => void
  onViewAllProjects?: () => void
}

export function RecentProjectsCard({ projects, icon, onAddProject, onViewAllProjects }: ProjectsCardProps) {
  const t = useTranslations("dashboard")
  
  return (
    <ItemCard
      title={t("recentProjects.title")}
      emptyText={t("recentProjects.empty")}
      addButtonText={t("recentProjects.addNew")}
      viewAllText={t("recentProjects.viewAll")}
      onAddClick={onAddProject}
      onViewAllClick={onViewAllProjects}
      isEmpty={projects.length === 0}
    >
      {projects.map(project => (
        <ItemRow
          key={project.id}
          id={project.id}
          title={project.title}
          description={project.description || t("noDescription")}
          updatedAt={project.updatedAt}
          icon={icon}
          updatedAtKey="recentProjects.updatedAt"
        />
      ))}
    </ItemCard>
  )
} 