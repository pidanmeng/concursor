'use client'

import { Tag } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/Logos'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TagListProps {
  tags: (Tag | string)[] | null | undefined
  maxVisible?: number
  className?: string
}

interface TagBadgeProps {
  tag: string
  className?: string
}

export const TagBadge = forwardRef<HTMLDivElement, TagBadgeProps>(
  ({ tag, className = '' }, ref) => {
    return (
      <Badge ref={ref} variant="secondary" className={cn('h-6', className)}>
        <Logo name={tag} />
        {tag}
      </Badge>
    )
  },
)

TagBadge.displayName = 'TagBadge'

export function TagList({ tags, maxVisible = 3, className = '' }: TagListProps) {
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return null
  }

  // 处理标签显示，根据maxVisible参数控制显示数量
  const displayTags = tags.slice(0, maxVisible)
  const hasMoreTags = tags.length > maxVisible

  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      {displayTags.map((tag) => {
        const tagName = typeof tag === 'string' ? tag : tag.name
        return <TagBadge key={typeof tag === 'string' ? tag : tag.id} tag={tagName} />
      })}

      {hasMoreTags && (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="h-6">
                +{tags.length - maxVisible}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-1 p-1">
                {tags.slice(maxVisible).map((tag) => (
                  <TagBadge
                    key={typeof tag === 'string' ? tag : tag.id}
                    tag={typeof tag === 'string' ? tag : tag.name}
                  />
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
