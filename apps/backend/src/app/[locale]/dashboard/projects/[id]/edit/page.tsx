import { getProject } from '@/actions/projects'
import { notFound } from 'next/navigation'
import { EditProjectClient } from './page.client'

interface ProjectEditProps {
  params: {
    id: string
  }
}

export default async function ProjectEdit({ params }: ProjectEditProps) {
  try {
    const project = await getProject(params.id)
    return <EditProjectClient project={project} />
  } catch (error) {
    console.error('获取项目失败:', error)
    notFound()
  }
} 