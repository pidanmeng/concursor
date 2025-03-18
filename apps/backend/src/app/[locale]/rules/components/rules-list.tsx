'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RuleCard } from './rule-card'
import type { RulesData } from '@/actions/rules'
import { Rule } from '@/payload-types'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { getRules } from '@/actions/rules'

interface RulesListProps {
  initialData: RulesData
}

export function RulesList({ initialData }: RulesListProps) {
  const t = useTranslations('rules')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialData.hasNextPage)
  const [page, setPage] = useState(1)
  const [rules, setRules] = useState<Rule[]>(initialData.docs)
  const loadingRef = useRef<HTMLDivElement>(null)

  const [searchValue, setSearchValue] = useState(searchParams.get('query') || '')

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      })

      return newSearchParams.toString()
    },
    [searchParams],
  )

  const handleSearch = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getRules(1, 24, searchValue || '')
      setRules(data.docs)
      setPage(1)
      setHasMore(true)

      router.push(
        `?${createQueryString({
          query: searchValue || null,
          page: 1,
        })}`,
        { scroll: false },
      )
    } catch {
      toast.error(t('searchFailed'), {
        description: t('searchFailedDescription'),
      })
    } finally {
      setIsLoading(false)
    }
  }, [router, createQueryString, searchValue, t])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const nextPage = page + 1
      const data = await getRules(nextPage, 24, searchValue || '')

      if (data.docs.length === 0) {
        setHasMore(false)
      } else {
        setRules((prev) => [...prev, ...data.docs])
        setPage(nextPage)
      }
    } catch {
      toast.error(t('loadFailed'), {
        description: t('loadMoreFailedDescription'),
      })
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, page, searchValue, t])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )

    if (loadingRef.current) {
      observer.observe(loadingRef.current)
    }

    return () => observer.disconnect()
  }, [loadMore])

  const handleDownload = useCallback((rule: Rule) => {
    const blob = new Blob([rule.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${rule.title}.mdc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const handleAddToProject = useCallback(() => {
    // TODO: 实现添加到项目的功能
    toast(t('featureInDevelopment'), {
      description: t('addToProjectComingSoon'),
    })
  }, [t])

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {rules.map((rule) => (
          <RuleCard
            key={rule.id}
            rule={rule}
            onDownload={handleDownload}
            onAddToProject={handleAddToProject}
          />
        ))}
      </div>

      {hasMore && (
        <div ref={loadingRef} className="h-20 flex items-center justify-center mt-4">
          {isLoading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          )}
        </div>
      )}
    </div>
  )
}
