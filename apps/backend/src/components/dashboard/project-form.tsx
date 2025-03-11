import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from 'next-intl'
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
}

export function ProjectForm({ form }: ProjectFormProps) {
  const t = useTranslations('dashboard.addProject.form')

  return (
    <>
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
    </>
  )
} 