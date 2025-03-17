'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Rule, User } from '@/payload-types'
import { Copy, Download, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TagList } from '@/components/tag-list'

interface RuleCardProps {
  rule: Rule
  onAddToProject?: (rule: Rule) => void
  onDownload?: (rule: Rule) => void
}

export function RuleCard({ rule, onAddToProject, onDownload }: RuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const t = useTranslations('dashboard.rules')

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isExpanded])

  useOutsideClick(ref, () => setIsExpanded(false))

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rule.content)
      toast.success(t('copySuccess'), {
        description: t('copySuccessDescription'),
      })
    } catch (err) {
      toast.error(t('copyFailed'), {
        description: t('copyFailedDescription'),
      })
    }
  }

  const creator = rule.creator?.value as User
  const creatorName =
    creator && typeof creator !== 'string' ? creator.name || creator.email : t('unknownUser')
  const creatorAvatar = creator && typeof creator !== 'string' ? creator.image : null

  const cardContent = (
    <Card className="w-full h-full hover:bg-muted dark:hover:bg-muted transition-colors">
      <CardHeader className="px-6">
        <motion.div layoutId={`title-${rule.id}-${id}`}>
          <CardTitle className="flex items-center justify-between">
            <span className="text-ellipsis whitespace-nowrap overflow-hidden py-2">{rule.title}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy()
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onDownload?.(rule)
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToProject?.(rule)
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </motion.div>
        <motion.div layoutId={`description-${rule.id}-${id}`}>
          <CardDescription className="line-clamp-2">{rule.description}</CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        <TagList tags={rule.tags} />
      </CardContent>
    </Card>
  )

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      {/* 占位卡片 */}
      <motion.div
        layoutId={`card-${rule.id}-${id}`}
        onClick={() => setIsExpanded(true)}
        className={`cursor-pointer ${isExpanded ? 'invisible' : ''}`}
      >
        {cardContent}
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4 bg-background/80">
            <motion.button
              key={`close-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex absolute top-4 right-4 items-center justify-center bg-background rounded-full h-8 w-8"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-4 w-4" />
            </motion.button>
            <motion.div
              layoutId={`card-${rule.id}-${id}`}
              ref={ref}
              className="w-full max-w-[600px] max-h-[calc(100vh-2rem)] flex flex-col bg-background dark:bg-background rounded-xl overflow-hidden"
            >
              <CardHeader className="p-6">
                <motion.div layoutId={`title-${rule.id}-${id}`}>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-ellipsis whitespace-nowrap overflow-hidden py-2">
                      {rule.title}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={handleCopy}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDownload?.(rule)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onAddToProject?.(rule)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </motion.div>
                <motion.div layoutId={`description-${rule.id}-${id}`}>
                  <CardDescription>{rule.description}</CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto px-6 overflow-x-hidden py-2">
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  <TagList tags={rule.tags} />
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="text-sm whitespace-pre-wrap bg-muted dark:bg-muted p-4 rounded-lg">
                      {rule.content}
                    </pre>
                  </div>
                </motion.div>
              </CardContent>
              <CardFooter className="flex justify-end text-sm text-muted-foreground p-6 border-t">
                <div className="flex items-center gap-2 text-xs">
                  <Avatar className="size-4">
                    <AvatarImage src={creatorAvatar || ''} alt={creatorName || ''} />
                    <AvatarFallback>
                      {creatorName?.charAt(0).toUpperCase() || creatorName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {creatorName}
                </div>
              </CardFooter>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
