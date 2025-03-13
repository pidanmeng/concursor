'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { createRule } from '@/actions/rules'
import { RuleForm } from '@/components/dashboard/rule-form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRuleFormSchema, RuleFormValues } from '@/forms/rule'

export default function NewRuleClient() {
  const t = useTranslations('dashboard.rules.new')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const ruleFormSchema = useRuleFormSchema()

  // 初始化表单
  const form = useForm<RuleFormValues>({
    resolver: zodResolver(ruleFormSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      globs: '',
      private: false,
      tags: [],
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

        const createdRule = await createRule(formattedValues)

        toast.success(t('createSuccess'), {
          description: t('createSuccessDescription'),
        })

        // 创建成功后返回列表页
        router.push('/dashboard/rules')
        router.refresh()

        return createdRule
      } catch (error) {
        console.error('创建规则失败:', error)
        toast.error(t('createFailed'), {
          description: String(error),
        })
        throw error
      } finally {
        setLoading(false)
      }
    },
    [router, t],
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
