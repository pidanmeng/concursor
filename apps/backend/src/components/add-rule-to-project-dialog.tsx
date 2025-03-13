'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Rule } from '@/payload-types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon, SearchIcon } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { TagList } from '@/components/tag-list'
import { getUserRules } from '@/actions/rules'
import { cn } from '@/lib/utils'

interface AddRuleToProjectDialogProps {
  onAddRules: (ruleIds: string[]) => Promise<void>
  existingRuleIds?: string[]
}

export function AddRuleToProjectDialog({ 
  onAddRules,
  existingRuleIds = []
}: AddRuleToProjectDialogProps) {
  const t = useTranslations('dashboard.projects')
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = async () => {
    if (selectedRuleIds.length === 0) return
    
    try {
      setIsAdding(true)
      await onAddRules(selectedRuleIds)
      setOpen(false)
      setSelectedRuleIds([])
    } catch (error) {
      console.error('添加规则失败:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleRule = (ruleId: string) => {
    setSelectedRuleIds(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId) 
        : [...prev, ruleId]
    )
  }

  const loadRules = useCallback(async (query = '') => {
    setLoading(true)
    try {
      const result = await getUserRules(1, 50, query)
      // 过滤掉已经添加到项目的规则
      const filteredRules = result.docs.filter(rule => 
        !existingRuleIds.includes(rule.id)
      )
      setRules(filteredRules)
    } catch (error) {
      console.error('加载规则失败:', error)
      setRules([])
    } finally {
      setLoading(false)
    }
  }, [existingRuleIds])

  useEffect(() => {
    if (open) {
      loadRules(searchQuery)
      // 打开对话框时清空之前的选择
      setSelectedRuleIds([])
    }
  }, [loadRules, open, searchQuery])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <PlusIcon className="w-4 h-4 mr-2" />
          {t('addRule')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('addRuleDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('addRuleDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center rounded-md border px-3 mb-4">
          <SearchIcon className="h-4 w-4 opacity-50 mr-2" />
          <Input 
            placeholder={t('addRuleDialog.searchPlaceholder')}
            className="border-0 focus-visible:ring-0 px-0 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner />
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery 
              ? t('addRuleDialog.noSearchResults') 
              : t('addRuleDialog.noRules')}
          </div>
        ) : (
          <ScrollArea className="max-h-72 overflow-y-auto pr-3">
            <div className="space-y-3">
              {rules.map((rule) => {
                const isSelected = selectedRuleIds.includes(rule.id)
                return (
                  <div
                    key={rule.id}
                    className={cn(
                      "flex items-start space-x-3 border rounded-md p-3 hover:bg-muted/50 transition-colors cursor-pointer",
                      isSelected && "bg-muted border-primary"
                    )}
                    onClick={() => handleToggleRule(rule.id)}
                  >
                    <div className="flex-shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        id={rule.id} 
                        checked={isSelected}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label 
                        htmlFor={rule.id}
                        className="font-medium cursor-pointer text-base"
                      >
                        {rule.title}
                      </Label>
                      {rule.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {rule.description}
                        </p>
                      )}
                      {rule.tags && rule.tags.length > 0 && (
                        <div className="mt-2">
                          <TagList tags={rule.tags} maxVisible={3} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            {t('cancel')}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedRuleIds.length > 0 && t('selectedRules', { count: selectedRuleIds.length })}
            </span>
            <Button 
              onClick={handleAdd} 
              disabled={selectedRuleIds.length === 0 || isAdding}
            >
              {isAdding ? t('adding') : t('addRuleDialog.addBtn')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 