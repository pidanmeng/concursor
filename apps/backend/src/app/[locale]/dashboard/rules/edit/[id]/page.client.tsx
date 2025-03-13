'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { updateRule } from '@/actions/rules'
import type { Rule } from '@/payload-types'
import { RuleForm } from '@/components/dashboard/rule-form'
import { useForm } from 'react-hook-form'
import { RuleFormValues } from '@/forms/rule'

interface EditRuleClientProps {
  rule: Rule
}

export default function EditRuleClient({ rule }: EditRuleClientProps) {
  const t = useTranslations('dashboard.rules.edit')
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // 初始化表单
  const form = useForm<RuleFormValues>({
    defaultValues: {
      title: rule.title,
      description: rule.description || '',
      content: rule.content,
      globs: rule.globs || '',
      private: rule.private || false,
      tags: Array.isArray(rule.tags)
        ? rule.tags.map((tag) =>
            typeof tag === 'string' ? { id: tag, name: tag } : { id: tag.id, name: tag.name },
          )
        : [],
    },
  })

  // 处理表单提交
  const handleSubmit = useCallback(
    async (values: RuleFormValues) => {
      try {
        setLoading(true)

        // 转换tags为API所需的ID数组格式
        const formattedValues = {
          ...values,
          tags: values.tags.map((tag) => tag.id),
        }

        const updatedRule = await updateRule(rule.id, formattedValues)

        toast.success(t('updateSuccess'), {
          description: t('updateSuccessDescription'),
        })

        // 更新成功后返回列表页
        router.push(`/dashboard/rules/${updatedRule.id}`)
        router.refresh()

        return updatedRule
      } catch (error) {
        console.error('更新规则失败:', error)
        toast.error(t('updateFailed'), {
          description: String(error),
        })
        throw error
      } finally {
        setLoading(false)
      }
    },
    [rule.id, router, t],
  )

  return (
    <>
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

      <div className="rounded-md border border-border/50 overflow-hidden shadow-sm p-6">
        <RuleForm form={form} disableSubmit />
      </div>
    </>
  )
}
