'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { format, formatDistanceToNow } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { MoreHorizontal, Pencil, Trash2, Copy, Tag } from 'lucide-react'
import { toast } from 'sonner'

import { Project } from '@/payload-types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => Promise<void>
  onDuplicate: (id: string) => Promise<Project | void>
}

export function ProjectCard({ project, onDelete, onDuplicate }: ProjectCardProps) {
  const t = useTranslations('dashboard.projects')
  const locale = useLocale() as string
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)

  // 选择合适的日期语言
  const dateLocale = locale === 'zh' ? zhCN : enUS

  // 解析更新时间
  const updateDate = new Date(project.updatedAt)
  const isValidDate = !isNaN(updateDate.getTime())

  // 计算相对时间
  const relativeTime = isValidDate
    ? formatDistanceToNow(updateDate, {
        addSuffix: true, // 添加"前"或"ago"后缀
        locale: dateLocale,
      })
    : t('unknownTime')

  // 完整日期时间格式
  const fullDateTime = isValidDate
    ? format(updateDate, 'yyyy-MM-dd HH:mm:ss', { locale: dateLocale })
    : t('invalidDate')

  // 计算规则数量
  const rulesCount = project.rules?.length || 0

  // 处理标签显示，最多显示3个
  const displayTags = project.tags
    ? Array.isArray(project.tags)
      ? project.tags.slice(0, 3)
      : []
    : []
  
  const hasMoreTags = project.tags && Array.isArray(project.tags) && project.tags.length > 3

  // 处理编辑
  const handleEdit = () => {
    router.push(`/dashboard/projects/edit/${project.id}`)
  }

  // 处理删除
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(project.id)
      toast.success(t('deleteSuccess'))
    } catch (error) {
      console.error('删除项目失败:', error)
      toast.error(t('deleteFailed'))
    } finally {
      setIsDeleting(false)
    }
  }

  // 处理复制
  const handleDuplicate = async () => {
    try {
      setIsDuplicating(true)
      await onDuplicate(project.id)
      toast.success(t('duplicateSuccess'))
    } catch (error) {
      console.error('复制项目失败:', error)
      toast.error(t('duplicateFailed'))
    } finally {
      setIsDuplicating(false)
    }
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold truncate" title={project.title}>
            {project.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">{t('actions')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                {t('editBtn')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate} disabled={isDuplicating}>
                <Copy className="mr-2 h-4 w-4" />
                {t('duplicate')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description || t('noDescription')}
        </p>

        <div className="flex items-center gap-1.5 mt-auto">
          {displayTags.map((tag) => {
            const tagName = typeof tag === 'string' ? tag : tag.name
            return (
              <Badge key={typeof tag === 'string' ? tag : tag.id} variant="outline" className="h-6">
                <Tag className="h-3 w-3 mr-1" />
                {tagName}
              </Badge>
            )
          })}
          
          {hasMoreTags && (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="h-6">
                    +{(project.tags?.length || 0) - 3}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-col gap-1 p-1">
                    {project.tags?.slice(3).map((tag) => (
                      <div key={typeof tag === 'string' ? tag : tag.id} className="text-sm flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {typeof tag === 'string' ? tag : tag.name}
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4 flex justify-between text-xs text-muted-foreground">
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                {t('updatedAt')}: {relativeTime}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {fullDateTime}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div>
          {t('rulesCount')}: {rulesCount}
        </div>
      </CardFooter>
    </Card>
  )
} 