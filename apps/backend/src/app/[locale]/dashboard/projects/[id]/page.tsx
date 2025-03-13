import { getProject } from '@/actions/projects'
import { getTranslations } from 'next-intl/server'
import { TagList } from '@/components/tag-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CalendarIcon, FileIcon, PencilIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { NotFound } from '@/components/404'

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
        <div className="flex items-center justify-between">
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

        {project.description && <p className="mt-4 text-muted-foreground">{project.description}</p>}
      </div>

      <TagList tags={project.tags} maxVisible={5} className="mt-4" />

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t('associatedRules')}</h2>
        <div className="grid grid-cols-1 gap-4">
          {project.rules?.map((ruleItem) => {
            if (!ruleItem.rule || typeof ruleItem.rule === 'string') return null

            return (
              <Card key={ruleItem.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/rules/${ruleItem.rule.id}`}
                          className="text-lg font-medium hover:underline"
                        >
                          {ruleItem.alias || ruleItem.rule.title}
                        </Link>
                        {ruleItem.alias && (
                          <span className="text-sm text-muted-foreground">
                            ({ruleItem.rule.title})
                          </span>
                        )}
                      </div>
                      {ruleItem.rule.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {ruleItem.rule.description}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/rules/${ruleItem.rule.id}`}>{t('viewRule')}</Link>
                    </Button>
                  </div>
                  {ruleItem.rule.tags && (
                    <div className="mt-3">
                      <TagList tags={ruleItem.rule.tags} maxVisible={3} />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
