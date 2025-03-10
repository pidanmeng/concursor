import { formatDate } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { MoreHorizontal } from "lucide-react"

interface ItemRowProps {
  id: string
  title: string
  description?: string
  updatedAt: string
  icon: React.ReactNode
  updatedAtKey?: string
}

export function ItemRow({
  title,
  description,
  updatedAt,
  icon,
  updatedAtKey = "recentRules.updatedAt"
}: ItemRowProps) {
  const t = useTranslations("dashboard")
  const locale = useLocale()
  
  return (
    <div className="flex items-start space-x-4 border-b pb-4 last:border-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-medium">{title}</p>
          <div className="flex items-center text-muted-foreground">
            <button className="rounded-full h-8 w-8 p-0 inline-flex items-center justify-center hover:bg-accent hover:text-accent-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {description || t('noDescription')}
        </p>
        <div className="flex items-center pt-1">
          <p className="text-xs text-muted-foreground">
            {t(updatedAtKey)} {formatDate(updatedAt, locale)}
          </p>
        </div>
      </div>
    </div>
  )
} 