'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Project, Rule } from '@/payload-types'
import { ProjectRuleCard } from '@/components/project-rule-card'
import { AddRuleToProjectDialog } from '@/components/add-rule-to-project-dialog'
import { CreateRuleDialog } from '@/components/create-rule-dialog'
import { addRulesToProject, removeRuleFromProject, updateRuleAlias } from '@/actions/projects'

interface ProjectDetailClientProps {
  project: Project
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const t = useTranslations('dashboard.projects')
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  // 添加规则到项目
  const handleAddRules = async (ruleIds: string[]) => {
    if (isUpdating) return

    try {
      setIsUpdating(true)
      await addRulesToProject(project.id, ruleIds)
      toast.success(t('addRuleSuccess'))
      router.refresh()
    } catch (error) {
      console.error('添加规则失败:', error)
      toast.error(t('addRuleFailed'))
    } finally {
      setIsUpdating(false)
    }
  }

  // 创建规则并添加到项目
  const handleCreateAndAddRule = async (rule: Rule) => {
    try {
      await handleAddRules([rule.id])
    } catch (error) {
      console.error('添加新规则到项目失败:', error)
      throw error
    }
  }

  // 从项目中移除规则
  const handleRemoveRule = async (ruleItemId: string) => {
    if (isUpdating) return

    try {
      setIsUpdating(true)
      await removeRuleFromProject(project.id, ruleItemId)
      toast.success(t('removeRuleSuccess'))
      router.refresh()
    } catch (error) {
      console.error('移除规则失败:', error)
      toast.error(t('removeRuleFailed'))
    } finally {
      setIsUpdating(false)
    }
  }

  // 更新规则别名
  const handleUpdateAlias = async (ruleItemId: string, alias: string) => {
    if (isUpdating) return

    try {
      setIsUpdating(true)
      await updateRuleAlias(project.id, ruleItemId, alias)
      toast.success(t('updateAliasSuccess'))
      router.refresh()
    } catch (error) {
      console.error('更新别名失败:', error)
      toast.error(t('updateAliasFailed'))
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-0">
      <div className="sticky top-0 z-10 -mx-4 bg-primary-foreground backdrop-blur-sm shadow-sm transition-all duration-200">
        <div className="flex items-center justify-between py-3 px-4">
          <h2 className="text-lg font-semibold">{t('associatedRules')}</h2>
          <div className="flex gap-2">
            <CreateRuleDialog onSuccess={handleCreateAndAddRule} buttonVariant="outline">
              {t('createRuleBtnText')}
            </CreateRuleDialog>

            <AddRuleToProjectDialog
              onAddRules={handleAddRules}
              existingRuleIds={
                (
                  project.rules?.map((ruleObj) => {
                    return typeof ruleObj.rule === 'string' ? ruleObj : ruleObj.rule?.id
                  }) || []
                ).filter(Boolean) as string[]
              }
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        {!project.rules || project.rules.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">{t('noRulesAssociated')}</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {project.rules.map((ruleItem) => {
              if (!ruleItem.rule || typeof ruleItem.rule === 'string') return null

              return (
                <ProjectRuleCard
                  key={ruleItem.id}
                  rule={ruleItem.rule}
                  alias={ruleItem.alias}
                  itemId={ruleItem.id || ''}
                  onEditAlias={handleUpdateAlias}
                  onRemove={handleRemoveRule}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
