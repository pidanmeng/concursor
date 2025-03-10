import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  description: string
  value: number
  icon: React.ReactNode
  className?: string
}

export function StatsCard({ title, description, value, icon, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="leading-none font-semibold ">{title}</div>
            <div className="text-muted-foreground w-4 h-4">{icon}</div>
          </div>
          <div className="text-muted-foreground ">{description}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
