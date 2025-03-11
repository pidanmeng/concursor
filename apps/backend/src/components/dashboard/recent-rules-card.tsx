import { Rule } from '@/payload-types'
import { useTranslations } from 'next-intl'
import { Settings } from 'lucide-react'
import { memo, useCallback } from 'react'
import { GenericItemCard } from './generic-item-card'
import { ItemRow } from './item-row'
import { useSetAtom } from 'jotai'
import { recentRulesAtom, statsAtom } from '@/states/dashboard'
import { DashboardData } from '@/actions/dashboard'
import { AddRulesSheet } from './add-rules-sheet'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const RECENT_LIMIT = 5

export interface RecentRulesCardProps {
  rules: Rule[]
  onViewAllRules?: () => void
}

export const RecentRulesCard = memo(function RecentRulesCard({
  rules,
  onViewAllRules,
}: RecentRulesCardProps) {
  const t = useTranslations('dashboard')
  const setRecentRules = useSetAtom(recentRulesAtom)
  const setStats = useSetAtom(statsAtom)

  const onSuccess = useCallback(
    (rule: Rule) => {
      setRecentRules((prev: Rule[]) => [rule, ...prev].slice(0, RECENT_LIMIT))
      setStats((prev: DashboardData['stats']) => ({
        ...prev,
        rules: { ...prev.rules, value: prev.rules.value + 1 },
      }))
    },
    [setRecentRules, setStats],
  )

  return (
    <GenericItemCard<Rule>
      title={t('recentRules.title')}
      emptyText={t('recentRules.empty')}
      viewAllText={t('recentRules.viewAll')}
      items={rules}
      onViewAllClick={onViewAllRules}
      addButton={
        <AddRulesSheet onSuccess={onSuccess}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('addRule.btn')}
          </Button>
        </AddRulesSheet>
      }
      renderItem={(rule) => (
        <ItemRow<Rule>
          id={rule.id}
          title={rule.title}
          description={rule.description || t('noDescription')}
          updatedAt={rule.updatedAt}
          icon={<Settings className="text-primary h-5 w-5" />}
          item={rule}
          translationPrefix="dashboard.recentRules"
        />
      )}
    />
  )
})
