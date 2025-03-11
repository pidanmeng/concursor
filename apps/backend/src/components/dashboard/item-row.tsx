import { formatDate } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { memo } from 'react'

export interface ItemRowProps<T> {
  id: string
  title: string
  description?: string
  updatedAt: string
  icon: React.ReactNode
  item: T
  translationPrefix: string
  onItemClick?: (item: T) => void
}

export function ItemRowComponent<T>({
  title,
  description,
  updatedAt,
  icon,
  item,
  translationPrefix,
  onItemClick,
}: ItemRowProps<T>) {
  const t = useTranslations()

  return (
    <div 
      className="flex items-start space-x-4 p-4 rounded-md border hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => onItemClick?.(item)}
    >
      <div className="mt-1">{icon}</div>
      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="font-medium leading-none line-clamp-1">{title}</div>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {t(`${translationPrefix}.updatedAt`, {
            date: formatDate(updatedAt),
          })}
        </p>
      </div>
    </div>
  )
}

// 使用泛型记忆化组件
export const ItemRow = memo(ItemRowComponent) as typeof ItemRowComponent 