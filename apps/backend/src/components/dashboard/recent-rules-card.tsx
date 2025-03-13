import { Rule } from '@/payload-types'
import { useTranslations } from 'next-intl'
import { Settings } from 'lucide-react'
import { memo } from 'react'
import { GenericItemCard } from './generic-item-card'
import { ItemRow } from './item-row'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Link, useRouter } from '@/i18n/routing'


export interface RecentRulesCardProps {
  rules: Rule[]
  onViewAllRules?: () => void
}

export const RecentRulesCard = memo(function RecentRulesCard({
  rules,
  onViewAllRules,
}: RecentRulesCardProps) {
  const t = useTranslations('dashboard')

  const router = useRouter()
  // const setRecentRules = useSetAtom(recentRulesAtom)
  // const setStats = useSetAtom(statsAtom)

  // const onSuccess = useCallback(
  //   (rule: Rule) => {
  //     setRecentRules((prev: Rule[]) => [rule, ...prev].slice(0, RECENT_LIMIT))
  //     setStats((prev: DashboardData['stats']) => ({
  //       ...prev,
  //       rules: { ...prev.rules, value: prev.rules.value + 1 },
  //     }))
  //   },
  //   [setRecentRules, setStats],
  // )

  return (
    <GenericItemCard<Rule>
      title={t('recentRules.title')}
      emptyText={t('recentRules.empty')}
      viewAllText={t('recentRules.viewAll')}
      items={rules}
      onViewAllClick={onViewAllRules}
      addButton={
        <Button asChild>
          <Link href="/dashboard/rules/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('addRule.btn')}
          </Link>
        </Button>
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
          onItemClick={() => {
            router.push(`/dashboard/rules/${rule.id}`)
          }}
        />
      )}
    />
  )
})
