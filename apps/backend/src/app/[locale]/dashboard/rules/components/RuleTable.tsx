'use client'

import { useTranslations } from 'next-intl'
import { UnlockIcon, LockIcon } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

import type { Rule } from '@/payload-types'
import { RuleTableActions } from './RuleTableActions'
import { TagList } from '@/components/tag-list'

interface RuleTableProps {
  rules: Rule[]
  loading: boolean
  onToggleVisibility: (rule: Rule) => Promise<void>
  onEdit: (ruleId: string) => void
  onDelete: (ruleId: string) => Promise<void>
}

export function RuleTable({
  rules,
  loading,
  onToggleVisibility,
  onEdit,
  onDelete,
}: RuleTableProps) {
  const t = useTranslations('dashboard.rules')

  return (
    <div className="rounded-md border border-border/50 overflow-hidden shadow-sm">
      <Table>
        <TableCaption>{t('tableCaption')}</TableCaption>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[220px]">{t('column.title')}</TableHead>
            <TableHead className="hidden sm:table-cell">{t('column.tags')}</TableHead>
            <TableHead className="text-center">{t('column.downloads')}</TableHead>
            <TableHead className="text-center">{t('column.favorites')}</TableHead>
            <TableHead className="text-right">{t('column.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  <p className="text-sm text-muted-foreground">{t('loading')}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : rules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p className="text-lg font-medium">{t('noRules')}</p>
                  <p className="text-sm text-muted-foreground">{t('createFirst')}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            rules.map((rule) => (
              <TableRow key={rule.id} className="hover:bg-muted/20">
                <TableCell className="font-medium flex items-center gap-2">
                  {rule.private ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <LockIcon className="h-4 w-4 text-warning flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('privateRule')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <UnlockIcon className="h-4 w-4 text-success flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('publicRule')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <span className="truncate">{rule.title}</span>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <TagList tags={rule.tags} />
                </TableCell>
                <TableCell className="text-center">
                  <span className="px-2 py-1 rounded-md bg-muted/50 text-muted-foreground text-sm">
                    {rule.downloadCount || 0}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="px-2 py-1 rounded-md bg-muted/50 text-muted-foreground text-sm">
                    {rule.favoriteCount || 0}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <RuleTableActions
                    rule={rule}
                    onToggleVisibility={onToggleVisibility}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
