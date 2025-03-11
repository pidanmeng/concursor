import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { memo } from 'react'

export interface GenericItemCardProps<T> {
  title: string
  emptyText: string
  viewAllText: string
  items: T[]
  renderItem: (item: T) => React.ReactNode
  onViewAllClick?: () => void
  addButton?: React.ReactNode
  className?: string
  itemClassName?: string
  footerClassName?: string
}

function GenericItemCardComponent<T>({
  title,
  emptyText,
  viewAllText,
  items,
  renderItem,
  onViewAllClick,
  addButton,
  className,
  itemClassName,
  footerClassName,
}: GenericItemCardProps<T>) {
  const isEmpty = items.length === 0

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          {addButton}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {!isEmpty ? (
          <div className={cn('space-y-4', itemClassName)}>
            {items.map((item, index) =>
              index >= 3 ? null : <div key={index}>{renderItem(item)}</div>,
            )}
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center">
            <p className="text-center text-muted-foreground">{emptyText}</p>
          </div>
        )}
      </CardContent>
      {onViewAllClick && (
        <CardFooter className={cn('flex justify-center', footerClassName)}>
          <Button variant="outline" onClick={onViewAllClick}>
            {viewAllText}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

// 使用泛型记忆化组件
export const GenericItemCard = memo(GenericItemCardComponent) as typeof GenericItemCardComponent
