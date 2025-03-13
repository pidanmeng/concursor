import { getRule } from '@/actions/rules'
import { getTranslations } from 'next-intl/server'
import { TagList } from '@/components/tag-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, PencilIcon, UserIcon } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { NotFound } from '@/components/404'
import { ExpandableDescription } from '@/components/expandable-description'

interface RuleDetailProps {
  params: Promise<{
    id: string
  }>
}

export default async function RuleDetail({ params }: RuleDetailProps) {
  const t = await getTranslations('dashboard.rules')
  const { id } = await params
  const rule = await getRule(id)

  if (!rule) {
    return <NotFound />
  }

  const creatorName =
    rule.creator?.value && typeof rule.creator.value !== 'string'
      ? rule.creator.value.name
      : '未知作者'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-4 bg-primary-foreground sticky top-0 z-10">
        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          {rule.title}
        </h1>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="sm">
              <HeartIcon className="w-4 h-4 mr-2" />
              {t('favorite')}
            </Button>
            <Button variant="default" size="sm">
              <DownloadIcon className="w-4 h-4 mr-2" />
              {t('download')}
            </Button> */}
          <Button variant="default" size="sm" asChild>
            <Link href={`/dashboard/rules/edit/${id}`}>
              <PencilIcon className="w-4 h-4 mr-2" />
              {t('editBtn')}
            </Link>
          </Button>
        </div>
      </div>
      <div>
        <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            {creatorName}
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {new Date(rule.createdAt).toLocaleDateString()}
          </div>
          {/* <div className="flex items-center gap-2">
            <HeartIcon className="w-4 h-4" />
            {rule.favoriteCount || 0} {t('favorites')}
          </div>
          <div className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" />
            {rule.downloadCount || 0} {t('downloads')}
          </div> */}
        </div>
      </div>

      <TagList tags={rule.tags} maxVisible={5} className="mt-4" />

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold">{t('content')}</h2>
          </CardHeader>
          <CardContent>
            <pre className="p-4 rounded-lg bg-muted font-mono text-sm whitespace-pre-wrap">
              {rule.content}
            </pre>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">{t('details')}</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {rule.description && (
                <div>
                  <h3 className="font-medium mb-2">{t('descriptionTitle')}</h3>
                  <ExpandableDescription description={rule.description} />
                </div>
              )}
              {rule.globs && (
                <div>
                  <h3 className="font-medium mb-2">{t('globs')}</h3>
                  <Badge variant="outline">{rule.globs}</Badge>
                </div>
              )}
              {rule.forkedFrom && (
                <div>
                  <h3 className="font-medium mb-2">{t('forkedFrom')}</h3>
                  <Button variant="link" className="p-0 h-auto">
                    {typeof rule.forkedFrom === 'string' ? rule.forkedFrom : rule.forkedFrom.title}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
