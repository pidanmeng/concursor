import { getProject } from '@/actions/projects'
import { getTranslations } from 'next-intl/server'
import { TagList } from '@/components/tag-list'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CalendarIcon, FileIcon, PencilIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { NotFound } from '@/components/404'
import { ExpandableDescription } from '@/components/expandable-description'
import { ProjectDetailClient } from './page.client'

interface ProjectDetailProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectDetail({ params }: ProjectDetailProps) {
  const t = await getTranslations('dashboard.projects')
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    return <NotFound />
  }

  const creatorName =
    project.creator?.value && typeof project.creator.value !== 'string'
      ? project.creator.value.name
      : '未知作者'

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between py-4 bg-primary-foreground sticky top-0 z-10">
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {project.title}
          </h1>
          <div className="flex items-center gap-2">
            {/* <Button variant="outline" size="sm">
              {t('editBtn')}
            </Button>
            <Button variant="default" size="sm">
              {t('sync')}
            </Button> */}
            <Button variant="default" size="sm" asChild>
              <Link href={`/dashboard/projects/edit/${id}`}>
                <PencilIcon className="w-4 h-4 mr-2" />
                {t('editBtn')}
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            {creatorName}
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <FileIcon className="w-4 h-4" />
            {project.rules?.length || 0} {t('rules')}
          </div>
        </div>

        {project.description && (
          <div className="mt-4">
            <ExpandableDescription description={project.description} />
          </div>
        )}
        <TagList tags={project.tags} maxVisible={5} className="mt-4" />
      </div>

      <Separator />

      <ProjectDetailClient project={project} />
    </div>
  )
}
