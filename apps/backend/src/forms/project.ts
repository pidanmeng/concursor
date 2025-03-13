import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { z } from 'zod'

function getProjectFormSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
    title: z.string().min(2, {
      message: t('title.minLength'),
    }),
    description: z.string().optional(),
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
export type ProjectFormValues = z.infer<ReturnType<typeof useProjectFormSchema>>
export async function getProjectFormSchemaServerSide() {
  const t: ReturnType<typeof useTranslations> = await getTranslations('dashboard.addProject.form')
  return getProjectFormSchema(t)
}

export function useProjectFormSchema() {
  const t = useTranslations('dashboard.addProject.form')
  return getProjectFormSchema(t)
}
