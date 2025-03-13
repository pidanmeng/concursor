'use client'

import { Rule } from '@/payload-types'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GenericSheet } from './generic-sheet'
import { RuleForm } from './rule-form'
import { createRule } from '@/actions/rules'
import { memo } from 'react'
import { RuleFormValues, useRuleFormSchema } from '@/forms/rule'

interface AddRulesSheetProps {
  onSuccess?: (rule: Rule) => void
  children?: React.ReactNode
}

export const AddRulesSheet = memo(function AddRulesSheet({
  onSuccess,
  children,
}: AddRulesSheetProps) {
  const t = useTranslations('dashboard.addRule')
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

  // 表单提交处理
  const handleSubmit = async (values: RuleFormValues): Promise<Rule> => {
    // 转换tags为API所需的ID数组格式
    const formattedValues = {
      ...values,
      tags: values.tags.map((tag) => tag.id),
    }
    return await createRule(formattedValues)
  }

  return (
    <GenericSheet<RuleFormValues, Rule>
      title={t('title')}
      description={t('description')}
      formComponent={RuleForm}
      form={form}
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      previewField="content"
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
