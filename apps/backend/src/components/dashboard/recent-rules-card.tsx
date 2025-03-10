import { useTranslations } from "next-intl"
import { ItemCard } from "./item-card"
import { ItemRow } from "./item-row"
import type { Rule } from "@/payload-types"

interface RulesCardProps {
  rules: Rule[]
  icon: React.ReactNode
  onAddRule?: () => void
  onViewAllRules?: () => void
}

export function RecentRulesCard({ rules, icon, onAddRule, onViewAllRules }: RulesCardProps) {
  const t = useTranslations("dashboard")
  
  return (
    <ItemCard
      title={t("recentRules.title")}
      emptyText={t("recentRules.empty")}
      addButtonText={t("recentRules.addNew")}
      viewAllText={t("recentRules.viewAll")}
      onAddClick={onAddRule}
      onViewAllClick={onViewAllRules}
      isEmpty={rules.length === 0}
    >
      {rules.map(rule => (
        <ItemRow
          key={rule.id}
          id={rule.id}
          title={rule.title}
          description={rule.description || t("noDescription")}
          updatedAt={rule.updatedAt}
          icon={icon}
        />
      ))}
    </ItemCard>
  )
} 