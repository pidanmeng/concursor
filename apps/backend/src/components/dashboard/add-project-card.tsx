'use client'

import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function AddProjectCard() {
  const t = useTranslations('dashboard.projects')
  const router = useRouter()

  return (
    <Card 
      className="h-full flex flex-col items-center justify-center border-dashed border-2 border-border/50 bg-primary-foreground/30 hover:bg-primary-foreground hover:border-primary/20 transition-colors duration-200 py-0"
    >
      <Button
        variant="ghost"
        className="w-full h-full flex flex-col gap-2 p-6"
        onClick={() => router.push('/dashboard/projects/new')}
      >
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <span className="text-lg font-medium">{t('addProject')}</span>
        <p className="text-sm text-muted-foreground">{t('addProjectDescription')}</p>
      </Button>
    </Card>
  )
} 