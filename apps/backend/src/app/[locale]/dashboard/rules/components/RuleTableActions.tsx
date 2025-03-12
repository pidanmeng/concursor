'use client'

import { useTranslations } from 'next-intl'
import { Edit2Icon, UnlockIcon, LockIcon, TrashIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import type { Rule } from '@/payload-types'

interface RuleTableActionsProps {
  rule: Rule
  onToggleVisibility: (rule: Rule) => Promise<void>
  onEdit: (ruleId: string) => void
  onDelete: (ruleId: string) => Promise<void>
}

export function RuleTableActions({
  rule,
  onToggleVisibility,
  onEdit,
  onDelete,
}: RuleTableActionsProps) {
  const t = useTranslations('dashboard.rules')

  return (
    <div className="flex justify-end space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onToggleVisibility(rule)}
            >
              {rule.private ? (
                <UnlockIcon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <LockIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {rule.private ? t('makePublic') : t('makePrivate')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit(rule.id)}
            >
              <Edit2Icon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {t('editBtn')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={() => onDelete(rule.id)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {t('delete')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
} 