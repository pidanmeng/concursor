'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { createProject } from '@/actions/projects'
import { ProjectForm } from '@/components/dashboard/project-form'
import { ProjectFormValues, useProjectFormSchema } from '@/forms/project'
import { useRouter } from '@/i18n/routing'

export function NewProjectClient() {
  const t = useTranslations('dashboard.projects.new')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const from = searchParams.get('from')

  const projectFormSchema = useProjectFormSchema()

  // 初始化表单
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
    },
  })

  // 处理表单提交
  const handleSubmit = useCallback(
    async (values: ProjectFormValues) => {
      try {
        setLoading(true)
        const createdProject = await createProject({
          title: values.title,
          description: values.description,
          tags: values.tags.map((tag) => tag.id),
        })

        toast.success(t('createSuccess'), {
          description: t('createSuccessDescription'),
        })

        let redirectUrl = `/dashboard/projects/${createdProject.id}`
        if (from?.startsWith('/')) {
          redirectUrl = from
        }
        router.push(redirectUrl)
        router.refresh()

        return createdProject
      } catch (error) {
        console.error('创建项目失败:', error)
        toast.error(t('createFailed'), {
          description: String(error),
        })
        throw error
      } finally {
        setLoading(false)
      }
    },
    [from, router, t],
  )

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between sticky top-0 bg-primary-foreground z-10 py-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-1">{t('description')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {t('submit')}
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-border/50 overflow-hidden shadow-sm p-6 flex-1">
        <ProjectForm
          form={form}
          onSubmit={handleSubmit}
          onSuccess={() => {}}
          loading={loading}
          disableSubmit
        />
      </div>
    </div>
  )
}
