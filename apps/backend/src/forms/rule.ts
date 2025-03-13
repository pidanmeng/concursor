import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { z } from 'zod'

function getRuleFormSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
    title: z.string().min(2, {
      message: t('title.minLength'),
    }),
    description: z.string().optional(),
    content: z.string().min(10, {
      message: t('content.minLength'),
    }),
    globs: z.string().optional(),
    private: z.boolean().default(false),
    tags: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
        }),
      )
      .default([]),
  })
}
export type RuleFormValues = z.infer<ReturnType<typeof useRuleFormSchema>>
export async function getRuleFormSchemaServerSide() {
  const t: ReturnType<typeof useTranslations> = await getTranslations('dashboard.addRule.form')
  return getRuleFormSchema(t)
}

export function useRuleFormSchema() {
  const t = useTranslations('dashboard.addRule.form')
  return getRuleFormSchema(t)
}
