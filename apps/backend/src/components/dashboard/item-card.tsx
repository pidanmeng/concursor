import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Plus } from 'lucide-react'

interface ItemCardProps {
  title: string
  emptyText: string
  addButtonText: string
  viewAllText: string
  onAddClick?: () => void
  onViewAllClick?: () => void
  children?: React.ReactNode
  isEmpty?: boolean
}

export function ItemCard({
  title,
  emptyText,
  addButtonText,
  viewAllText,
  onAddClick,
  onViewAllClick,
  children,
  isEmpty = false,
}: ItemCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button onClick={onAddClick}>
            <Plus /> {addButtonText}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
