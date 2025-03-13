'use client'

import { useTranslations } from 'next-intl'

import type { Rule } from '@/payload-types'
import { useRules } from '@/hooks/use-rules'
import { RuleTable } from './components/RuleTable'
import { RuleSearchBar } from './components/RuleSearchBar'
import { RulePagination } from './components/RulePagination'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'

// 客户端组件接口
interface RulesClientProps {
  initialRules: Rule[]
  initialTotalPages: number
  initialTotalDocs: number
}

export default function RulesClient({
  initialRules,
  initialTotalPages,
  initialTotalDocs,
}: RulesClientProps) {
  const t = useTranslations('dashboard.rules')
  
  // 使用自定义钩子管理规则相关逻辑
  const {
    rules,
    loading,
    currentPage,
    totalPages,
    totalDocs,
    inputValue,
    setInputValue,
    handlePageChange,
    handleSearch,
    handleDelete,
    handleToggleVisibility,
    handleEdit,
  } = useRules({
    initialRules,
    initialTotalPages,
    initialTotalDocs,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('description')}</p>
      </div>

      {/* 搜索和添加按钮 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <RuleSearchBar 
          searchQuery={inputValue}
          onSearchChange={setInputValue}
          onSearchSubmit={handleSearch}
        />
        
        <Button asChild>
          <Link href="/dashboard/rules/new">
            <Plus />
            {t('addRule')}
          </Link>
        </Button>
      </div>

      {/* 表格 */}
      <RuleTable 
        rules={rules}
        loading={loading}
        onToggleVisibility={handleToggleVisibility}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 分页 */}
      <RulePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalDocs={totalDocs}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
