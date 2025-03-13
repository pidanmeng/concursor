'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

interface ExpandableDescriptionProps {
  description: string
  initialLines?: number
}

export function ExpandableDescription({ description, initialLines = 3 }: ExpandableDescriptionProps) {
  const t = useTranslations('common')
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldShowButton, setShouldShowButton] = useState(false)
  
  // 计算文本行数
  useEffect(() => {
    const lineCount = description.split('\n').length
    setShouldShowButton(lineCount > initialLines)
  }, [description, initialLines])

  // 处理换行符
  const formattedDescription = description.split('\n').map((line, index, array) => (
    <span key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </span>
  ))

  return (
    <div className="relative">
      <div
        className={`text-sm text-muted-foreground ${
          !isExpanded ? `line-clamp-${initialLines}` : ''
        }`}
      >
        {formattedDescription}
      </div>
      
      {shouldShowButton && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 h-6 text-xs"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon className="w-4 h-4 mr-1" />
              {t('collapse')}
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-4 h-4 mr-1" />
              {t('expand')}
            </>
          )}
        </Button>
      )}
    </div>
  )
} 