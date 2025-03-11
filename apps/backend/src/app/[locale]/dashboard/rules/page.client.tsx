'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Edit2Icon, Eye, LockIcon, TrashIcon } from 'lucide-react'

import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import type { Rule } from '@/payload-types'
import { getUserRules } from '@/actions/rules'

// 客户端组件接口
interface RulesClientProps {
  initialRules: Rule[]
  initialTotalPages: number
  initialTotalDocs: number
}

export default function RulesClient({ 
  initialRules, 
  initialTotalPages, 
  initialTotalDocs 
}: RulesClientProps) {
  const t = useTranslations('Dashboard.Rules')
  const [rules, setRules] = useState<Rule[]>(initialRules)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [totalDocs, setTotalDocs] = useState(initialTotalDocs)
  const limit = 10

  // 加载规则数据
  const loadRules = async (page: number = 1) => {
    if (page === 1 && rules === initialRules) return; // 避免初始页面重复加载
    
    try {
      setLoading(true)
      // 使用服务器端 action 函数
      const data = await getUserRules(page, limit)
      setRules(data.docs)
      setTotalPages(data.totalPages)
      setTotalDocs(data.totalDocs)
      setCurrentPage(page)
    } catch (error) {
      console.error('加载规则失败', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentPage !== 1) {
      loadRules(currentPage)
    }
  }, [currentPage])

  // 处理页面变更
  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setCurrentPage(page)
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
      <p className="text-muted-foreground">{t('description')}</p>

      <div className="rounded-md border">
        <Table>
          <TableCaption>{t('tableCaption')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t('column.title')}</TableHead>
              <TableHead>{t('column.private')}</TableHead>
              <TableHead>{t('column.createdAt')}</TableHead>
              <TableHead>{t('column.updatedAt')}</TableHead>
              <TableHead className="text-right">{t('column.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">{t('loading')}</TableCell>
              </TableRow>
            ) : rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">{t('noRules')}</TableCell>
              </TableRow>
            ) : (
              rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.title}</TableCell>
                  <TableCell>
                    {rule.private ? (
                      <LockIcon className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-green-500" />
                    )}
                  </TableCell>
                  <TableCell>{formatDate(rule.createdAt)}</TableCell>
                  <TableCell>{formatDate(rule.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit2Icon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(currentPage - 1)
                  }}
                />
              </PaginationItem>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(page)
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(currentPage + 1)
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
