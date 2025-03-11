import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from 'next-intl'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

export const ruleFormSchema = z.object({
  title: z.string().min(2, {
    message: 'title.minLength',
  }),
  description: z.string().optional(),
  content: z.string().min(10, {
    message: 'content.minLength',
  }),
  globs: z.string().optional(),
  private: z.boolean().optional(),
})

export type RuleFormValues = z.infer<typeof ruleFormSchema>

interface RuleFormProps {
  form: UseFormReturn<RuleFormValues>
}

export function RuleForm({ form }: RuleFormProps) {
  const t = useTranslations('dashboard.addRule.form')

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
              <Input placeholder={t('descriptionPlaceholder')} {...field} />
            </FormControl>
            <FormMessage messagePreHandler={t} />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('content.label')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('contentPlaceholder')}
                className="h-[150px] resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage messagePreHandler={t} />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="globs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('globPattern')}</FormLabel>
            <FormControl>
              <Input placeholder={t('globPatternPlaceholder')} {...field} />
            </FormControl>
            <FormMessage messagePreHandler={t} />
          </FormItem>
        )}
      />
    </>
  )
} 