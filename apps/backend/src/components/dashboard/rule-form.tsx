'use client'

import { useTranslations } from 'next-intl'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { useCallback } from 'react'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { TagInput } from '@/components/dashboard/tag-input'
import { Rule } from '@/payload-types'

export const ruleFormSchema = z.object({
  title: z.string().min(2, {
    message: 'title.minLength',
  }),
  description: z.string().optional(),
  content: z.string().min(10, {
    message: 'content.minLength',
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

export type RuleFormValues = z.infer<typeof ruleFormSchema>

// 表单属性
export interface RuleFormProps {
  form: UseFormReturn<RuleFormValues>
  disableSubmit?: boolean
  onSubmit?: (values: RuleFormValues) => Promise<Rule>
  onSuccess?: (result: Rule) => void
  loading?: boolean
  submitLabel?: string
}

export function RuleForm({
  form,
  onSubmit,
  loading = false,
  submitLabel,
  onSuccess,
  disableSubmit = false,
}: RuleFormProps) {
  const t = useTranslations('dashboard.addRule.form')

  const handleSubmit = useCallback(
    async (values: RuleFormValues) => {
      try {
        const result = await onSubmit?.(values)
        if (result) {
          onSuccess?.(result)
        }
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
            rules={{ required: true, minLength: 2 }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('title.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('titlePlaceholder')} {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 描述字段 */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('description')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('descriptionPlaceholder')}
                    className="min-h-20"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 内容字段 - 使用Tabs在编辑和预览间切换 */}
          <div className="flex justify-between items-center mb-2">
            <FormLabel>{t('content.label')}</FormLabel>
          </div>

          <FormField
            control={form.control}
            name="content"
            rules={{ required: true, minLength: 10 }}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder={t('contentPlaceholder')}
                    className="min-h-40 font-mono text-sm"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 文件匹配模式 */}
          <FormField
            control={form.control}
            name="globs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('globPattern')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('globPatternPlaceholder')}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>{t('globPatternDescription')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 标签 */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('tags')}</FormLabel>
                <FormControl>
                  <TagInput
                    placeholder={t('tagsPlaceholder')}
                    value={field.value}
                    onChange={(newTags) => field.onChange(newTags)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 私有规则选项 */}
          <FormField
            control={form.control}
            name="private"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t('private')}</FormLabel>
                  <FormDescription>{t('privateDescription')}</FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* 提交按钮 */}
          {disableSubmit ? null : (
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? t('submitting') : submitLabel || t('submit')}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
