import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Project } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

// 定义表单验证模式
export const projectFormSchema = z.object({
  title: z.string().min(2, {
    message: 'title.minLength',
  }),
  description: z.string().optional(),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>

interface ProjectFormProps {
  form: UseFormReturn<ProjectFormValues>
  onSubmit: (values: ProjectFormValues) => Promise<Project>
  onSuccess?: (result: Project) => void
  loading?: boolean
  submitLabel?: string
}

export function ProjectForm({
  form,
  onSubmit,
  onSuccess,
  loading = false,
  submitLabel,
}: ProjectFormProps) {
  const t = useTranslations('dashboard.addProject.form')

  const handleSubmit = useCallback(
    async (values: ProjectFormValues) => {
      try {
        const result = await onSubmit(values)
        onSuccess?.(result)
      } catch (error) {
        console.error('表单提交出错:', error)
      }
    },
    [onSubmit, onSuccess],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-6">
          {/* 标题字段 */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('title.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('titlePlaceholder')} {...field} />
                </FormControl>
                <FormMessage messagePreHandler={t} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('description')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('descriptionPlaceholder')}
                    className="h-[150px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage messagePreHandler={t} />
              </FormItem>
            )}
          />
          {/* 提交按钮 */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t('submitting') : submitLabel || t('submit')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
