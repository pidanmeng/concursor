import { useTranslations } from 'next-intl'
import { ItemCard } from '@/components/dashboard/item-card'
import { ItemRow } from '@/components/dashboard/item-row'
import type { Rule } from '@/payload-types'
import { AddRulesDialog } from '@/components/dashboard/add-rules-dialog'
import { useSetAtom } from 'jotai'
import { statsAtom, recentRulesAtom } from '../page.client'
import { useCallback } from 'react'
import { DashboardData } from '@/actions/dashboard'
import { RECENT_LIMIT } from '../constants/dashboard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface RulesCardProps {
  rules: Rule[]
  icon: React.ReactNode
  onViewAllRules?: () => void
}

export function RecentRulesCard({ rules, icon, onViewAllRules }: RulesCardProps) {
  const t = useTranslations('dashboard')
  const setRecentRules = useSetAtom(recentRulesAtom)
  const setStats = useSetAtom(statsAtom)
  const onSuccess = useCallback(
    (rule: Rule) => {
      setRecentRules((prev) => [rule, ...prev].slice(0, RECENT_LIMIT))
      setStats((prev: DashboardData['stats']) => ({
        ...prev,
        rules: { ...prev.rules, value: prev.rules.value + 1 },
      }))
    },
    [setRecentRules, setStats],
  )
  return (
    <ItemCard
      title={t('recentRules.title')}
      emptyText={t('recentRules.empty')}
      viewAllText={t('recentRules.viewAll')}
      onViewAllClick={onViewAllRules}
      isEmpty={rules.length === 0}
      addButton={
        <AddRulesDialog onSuccess={onSuccess}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('addRule.btn')}
          </Button>
        </AddRulesDialog>
      }
    >
      {rules.map((rule) => (
        <ItemRow
          key={rule.id}
          id={rule.id}
          title={rule.title}
          description={rule.description || t('noDescription')}
          updatedAt={rule.updatedAt}
          icon={icon}
        />
      ))}
    </ItemCard>
  )
}
