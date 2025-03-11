import { Project } from '@/payload-types'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GenericSheet } from './generic-sheet'
import { ProjectForm, ProjectFormValues, projectFormSchema } from './project-form'
import { createProject } from '@/actions/dashboard'
import { memo } from 'react'

interface AddProjectsSheetProps {
  onSuccess?: (project: Project) => void
  children?: React.ReactNode
}

export const AddProjectsSheet = memo(function AddProjectsSheet({
  onSuccess,
  children,
}: AddProjectsSheetProps) {
  const t = useTranslations('dashboard.addProject')

  // 初始化表单
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  // 表单提交处理
  const handleSubmit = async (values: ProjectFormValues) => {
    return (await createProject(values)) as Project
  }

  return (
    <GenericSheet<ProjectFormValues, Project>
      title={t('title')}
      description={t('description')}
      formComponent={ProjectForm}
      form={form}
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
    >
      {children || (
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('btn')}
        </Button>
      )}
    </GenericSheet>
  )
})
