import { getTranslations } from 'next-intl/server'
import { getProjects, searchProjects } from '@/actions/projects'

import { ProjectsList } from './components/projects-list'

interface ProjectsProps {
  searchParams?: Promise<{
    q?: string;
  }>;
}

export default async function Projects({ searchParams }: ProjectsProps) {
  const t = await getTranslations('dashboard.projects')
  const params = await searchParams;
  const searchQuery = params?.q || '';
  
  // 在服务端获取项目列表，如果有搜索参数则执行搜索
  const projectsData = searchQuery 
    ? await searchProjects(searchQuery)
    : await getProjects();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('description')}
        </p>
      </div>

      <ProjectsList 
        initialProjects={projectsData.docs} 
        initialSearchQuery={searchQuery}
        totalPages={projectsData.totalPages}
        currentPage={projectsData.page}
        hasNextPage={projectsData.hasNextPage}
      />
    </div>
  )
}
