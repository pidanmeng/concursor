import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface ItemCardProps {
  title: string
  emptyText: string
  viewAllText: string
  onViewAllClick?: () => void
  children?: React.ReactNode
  isEmpty?: boolean
  addButton?: React.ReactNode
}

export function ItemCard({
  title,
  emptyText,
  viewAllText,
  onViewAllClick,
  children,
  isEmpty = false,
  addButton,
}: ItemCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          {addButton}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {!isEmpty ? (
          <div className="space-y-4">{children}</div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">{emptyText}</div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button variant="outline" className="w-full" onClick={onViewAllClick}>
          {viewAllText}
        </Button>
      </CardFooter>
    </Card>
  )
}
