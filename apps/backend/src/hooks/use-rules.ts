'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { debounce } from 'lodash'

import type { Rule } from '@/payload-types'
import { getUserRules, deleteRule, toggleRuleVisibility } from '@/actions/rules'

interface UseRulesOptions {
  initialRules: Rule[]
  initialTotalPages: number
  initialTotalDocs: number
}

export function useRules({ initialRules, initialTotalPages, initialTotalDocs }: UseRulesOptions) {
  const t = useTranslations('dashboard.rules')
  const router = useRouter()
  const [rules, setRules] = useState<Rule[]>(initialRules)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [totalDocs, setTotalDocs] = useState(initialTotalDocs)
  const [searchQuery, setSearchQuery] = useState('')
  const [inputValue, setInputValue] = useState('')
  const limit = 10

  // 用于防止连续多次请求的标记
  const loadingRef = useRef(false)

  // 加载规则数据 - 使用防抖
  const loadRulesDebounced = useMemo(
    () =>
      debounce(async (page: number = 1, query: string = '') => {
        if (loadingRef.current) return

        try {
          setLoading(true)
          loadingRef.current = true

          const data = await getUserRules(page, limit, query)

          setRules(data.docs)
          setTotalPages(data.totalPages)
          setTotalDocs(data.totalDocs)
          setCurrentPage(page)
        } catch (error) {
          console.error('加载规则失败', error)
          toast.error(t('loadFailed'), {
            description: String(error),
          })
        } finally {
          setLoading(false)
          loadingRef.current = false
        }
      }, 300),
    [t, limit],
  )

  // 标准的加载函数，直接调用防抖版本
  const loadRules = useCallback(
    (page: number = 1, query: string = '') => {
      loadRulesDebounced(page, query)
    },
    [loadRulesDebounced],
  )

  // 每当页面或搜索查询变化时重新加载数据
  useEffect(() => {
    loadRules(currentPage, searchQuery)

    // 组件卸载时取消防抖函数
    return () => {
      loadRulesDebounced.cancel()
    }
  }, [currentPage, searchQuery, loadRules, loadRulesDebounced])

  // 处理页面变更
  const handlePageChange = useCallback(
    (page: number) => {
      if (page === currentPage) return
      setCurrentPage(page)
    },
    [currentPage],
  )

  // 处理搜索
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setSearchQuery(inputValue)
      setCurrentPage(1)
    },
    [inputValue],
  )

  // 处理搜索输入变化 - 即时更新输入值，但搜索行为防抖
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value)
  }, [])

  // 输入后自动触发搜索的防抖函数
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value)
        setCurrentPage(1)
      }, 300),
    [],
  )

  // 监听输入值变化，防抖触发搜索
  useEffect(() => {
    debouncedSearch(inputValue)
    return () => debouncedSearch.cancel()
  }, [inputValue, debouncedSearch])

  // 处理删除
  const handleDelete = useCallback(
    async (ruleId: string): Promise<void> => {
      try {
        const rule = await deleteRule(ruleId)

        toast(t('deleteSuccess', { rule: rule.title }), {
          description: t('deleteSuccessDescription'),
          action: {
            label: t('undo'),
            onClick: async () => {
              await deleteRule(ruleId, { restore: true })
              await loadRules(currentPage, searchQuery)
            },
          },
        })

        // 重新加载当前页数据
        // 如果当前页只有一个规则，且不是第一页，则回到上一页
        if (rules.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1)
        } else {
          await loadRules(currentPage, searchQuery)
        }
      } catch (error) {
        console.error('删除规则失败', error)
        toast.error(t('deleteFailed'), {
          description: String(error),
        })
      }
    },
    [t, rules.length, currentPage, loadRules, searchQuery],
  )

  // 处理切换可见性
  const handleToggleVisibility = useCallback(
    async (rule: Rule): Promise<void> => {
      try {
        // 调用API切换可见性
        const updatedRule = await toggleRuleVisibility(rule.id)

        toast.success(updatedRule.private ? t('madePrivate') : t('madePublic'), {
          description: t('visibilityChanged'),
        })

        // 更新本地状态，避免重新请求
        setRules((prevRules) =>
          prevRules.map((r) => (r.id === rule.id ? { ...r, private: updatedRule.private } : r)),
        )
      } catch (error) {
        console.error('切换可见性失败', error)
        toast.error(t('toggleVisibilityFailed'), {
          description: String(error),
        })
      }
    },
    [t],
  )

  // 处理编辑 - 跳转到编辑页面
  const handleEdit = useCallback(
    (ruleId: string) => {
      // 跳转到编辑页面
      router.push(`/dashboard/rules/edit/${ruleId}`)
    },
    [router],
  )

  // 处理添加后的回调
  const handleAddSuccess = useCallback(
    (newRule: Rule) => {
      toast.success(t('addSuccess'), {
        description: t('addSuccessDescription'),
      })

      // 如果当前在第一页，直接更新状态，否则跳转到第一页
      if (currentPage === 1) {
        setRules((prev) => [newRule, ...prev].slice(0, limit))
        // 更新总数
        setTotalDocs((prev) => prev + 1)
        // 可能需要更新总页数
        const newTotalPages = Math.ceil((totalDocs + 1) / limit)
        if (newTotalPages > totalPages) {
          setTotalPages(newTotalPages)
        }
      } else {
        setCurrentPage(1)
      }
    },
    [currentPage, totalDocs, totalPages, t],
  )

  // 在组件卸载时，取消所有防抖函数
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
      loadRulesDebounced.cancel()
    }
  }, [debouncedSearch, loadRulesDebounced])

  return {
    rules,
    loading,
    currentPage,
    totalPages,
    totalDocs,
    searchQuery,
    inputValue,
    setInputValue: handleInputChange,
    handlePageChange,
    handleSearch,
    handleDelete,
    handleToggleVisibility,
    handleEdit,
    handleAddSuccess,
    loadRules,
  }
}
