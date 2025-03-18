'use client'

import { useTranslations } from 'next-intl'
import { UnlockIcon, LockIcon, Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'

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
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { Rule } from '@/payload-types'
import { RuleTableActions } from './RuleTableActions'
import { TagList } from '@/components/tag-list'
import { Link, useRouter } from '@/i18n/routing'
import { batchDeleteRules, batchUpdateRules } from '@/actions/rules'
import { toast } from 'sonner'

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
  const [selectedRules, setSelectedRules] = useState<string[]>([])
  const [isBatchProcessing, setIsBatchProcessing] = useState(false)
  const router = useRouter()

  // 处理全选
  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      setSelectedRules(checked ? rules.map(rule => rule.id) : [])
    }
  }

  // 处理单个选择
  const handleSelectOne = (checked: boolean | 'indeterminate', ruleId: string) => {
    if (typeof checked === 'boolean') {
      setSelectedRules(prev => 
        checked ? [...prev, ruleId] : prev.filter(id => id !== ruleId)
      )
    }
  }

  // 处理批量删除
  const handleBatchDelete = async () => {
    if (!selectedRules.length) return

    try {
      setIsBatchProcessing(true)
      const result = await batchDeleteRules(selectedRules)
      
      // 显示结果
      if (result.errors.length === 0) {
        toast.success(t('batchDeleteSuccess'))
      } else {
        toast.warning(t('batchDeletePartialSuccess'), {
          description: t('batchDeleteErrors', { count: result.errors.length })
        })
      }

      // 清除选择
      setSelectedRules([])
      router.refresh()
    } catch (error) {
      console.error('批量删除失败:', error)
      toast.error(t('batchDeleteFailed'))
    } finally {
      setIsBatchProcessing(false)
    }
  }

  // 处理批量修改可见性
  const handleBatchToggleVisibility = async (makePrivate: boolean) => {
    if (!selectedRules.length) return

    try {
      setIsBatchProcessing(true)
      const result = await batchUpdateRules(
        { id: { in: selectedRules } },
        { private: makePrivate }
      )

      // 显示结果
      if (result.errors.length === 0) {
        toast.success(makePrivate ? t('batchMadePrivate') : t('batchMadePublic'))
      } else {
        toast.warning(t('batchVisibilityPartialSuccess'), {
          description: t('batchVisibilityErrors', { count: result.errors.length })
        })
      }

      // 清除选择
      setSelectedRules([])
      router.refresh()
    } catch (error) {
      console.error('批量修改可见性失败:', error)
      toast.error(t('batchVisibilityFailed'))
    } finally {
      setIsBatchProcessing(false)
    }
  }

  return (
    <div className="rounded-md border border-border/50 overflow-hidden shadow-sm">
      {selectedRules.length > 0 && (
        <div className="bg-muted/30 p-2 flex items-center justify-between border-b border-border/50">
          <span className="text-sm text-muted-foreground">
            {t('selectedCount', { count: selectedRules.length })}
          </span>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isBatchProcessing}>
                  {t('batchVisibility')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBatchToggleVisibility(true)}>
                  <LockIcon className="mr-2 h-4 w-4" />
                  {t('makePrivate')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBatchToggleVisibility(false)}>
                  <UnlockIcon className="mr-2 h-4 w-4" />
                  {t('makePublic')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleBatchDelete}
              disabled={isBatchProcessing}
            >
              {isBatchProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {t('batchDelete')}
            </Button>
          </div>
        </div>
      )}
      <Table>
        <TableCaption>{t('tableCaption')}</TableCaption>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[40px] px-2">
              <Checkbox
                checked={selectedRules.length === rules.length && rules.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label={t('selectAll')}
              />
            </TableHead>
            <TableHead className="w-[220px]">{t('column.title')}</TableHead>
            <TableHead className="hidden sm:table-cell">{t('column.tags')}</TableHead>
            {/* <TableHead className="text-center">{t('column.downloads')}</TableHead>
            <TableHead className="text-center">{t('column.favorites')}</TableHead> */}
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
                <TableCell className="px-2">
                  <Checkbox
                    checked={selectedRules.includes(rule.id)}
                    onCheckedChange={(checked) => handleSelectOne(checked, rule.id)}
                    aria-label={t('selectRule', { rule: rule.title })}
                  />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex items-center gap-2">
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
                    <Button variant="link" asChild>
                      <Link href={`/dashboard/rules/${rule.id}`}>
                        <span className="truncate">{rule.title}</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <TagList tags={rule.tags} />
                </TableCell>
                {/* <TableCell className="text-center">
                  <span className="px-2 py-1 rounded-md bg-muted/50 text-muted-foreground text-sm">
                    {rule.downloadCount || 0}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="px-2 py-1 rounded-md bg-muted/50 text-muted-foreground text-sm">
                    {rule.favoriteCount || 0}
                  </span>
                </TableCell> */}
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
