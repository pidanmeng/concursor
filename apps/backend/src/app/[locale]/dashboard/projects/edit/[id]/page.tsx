import { getProject } from '@/actions/projects'
import { notFound } from 'next/navigation'
import { EditProjectClient } from './page.client'
import { NotFound } from '@/components/404'

interface ProjectEditProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectEdit({ params }: ProjectEditProps) {
  const { id } = await params
  try {
    const project = await getProject(id)
    if (!project) {
      return <NotFound />
    }
    return <EditProjectClient project={project} />
  } catch (error) {
    console.error('获取项目失败:', error)
    notFound()
  }
}
