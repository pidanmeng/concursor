'use client'

import { Rule } from '@/payload-types'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Edit2Icon, 
  ExternalLinkIcon, 
  XIcon, 
  CheckIcon 
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { TagList } from '@/components/tag-list'
import { ExpandableDescription } from '@/components/expandable-description'
import { cn } from '@/lib/utils'

export interface ProjectRuleCardProps {
  rule: Rule
  alias?: string | null
  itemId: string
  onEditAlias: (ruleId: string, alias: string) => Promise<void>
  onRemove: (ruleId: string) => Promise<void>
}

export function ProjectRuleCard({ 
  rule, 
  alias, 
  itemId,
  onEditAlias, 
  onRemove 
}: ProjectRuleCardProps) {
  const t = useTranslations('dashboard.projects')
  const [isEditing, setIsEditing] = useState(false)
  const [editAlias, setEditAlias] = useState(alias || '')
  const [isRemoving, setIsRemoving] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleEditClick = () => {
    setEditAlias(alias || '')
    setIsEditing(true)
  }

  const handleSaveAlias = async () => {
    try {
      setIsSaving(true)
      await onEditAlias(itemId, editAlias)
      setIsEditing(false)
    } catch (error) {
      console.error('保存别名失败:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemove = async () => {
    try {
      setIsRemoving(true)
      await onRemove(itemId)
    } catch (error) {
      console.error('移除规则失败:', error)
      setIsRemoving(false)
    }
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="px-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-grow">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2 flex-grow">
                  <Input
                    value={editAlias}
                    onChange={(e) => setEditAlias(e.target.value)}
                    placeholder={rule.title}
                    className="h-8"
                    autoFocus
                    onBlur={handleSaveAlias}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveAlias()}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleSaveAlias}
                    disabled={isSaving}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Link
                    href={`/dashboard/rules/${rule.id}`}
                    className="text-lg font-medium hover:underline"
                  >
                    {alias || rule.title}
                  </Link>
                  {alias && (
                    <span className="text-sm text-muted-foreground">
                      ({rule.title})
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-1"
                    onClick={handleEditClick}
                  >
                    <Edit2Icon className="h-3 w-3" />
                    <span className="sr-only">{t('editAlias')}</span>
                  </Button>
                </>
              )}
            </div>
            {rule.description && (
              <ExpandableDescription description={rule.description} />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link 
                href={`/dashboard/rules/${rule.id}`}
                className="flex items-center gap-1"
              >
                <span>{t('viewRule')}</span>
                <ExternalLinkIcon className="h-3 w-3 ml-1" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-destructive hover:text-destructive-foreground hover:bg-destructive",
                isRemoving && "opacity-50 pointer-events-none"
              )}
              onClick={handleRemove}
              disabled={isRemoving}
            >
              <XIcon className="h-4 w-4 mr-1" />
              {t('removeRule')}
            </Button>
          </div>
        </div>
        {rule.tags && (
          <div className="mt-3">
            <TagList tags={rule.tags} maxVisible={3} />
          </div>
        )}
      </CardContent>
    </Card>
  )
} 