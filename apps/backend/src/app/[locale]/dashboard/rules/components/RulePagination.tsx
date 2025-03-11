'use client'

import { useTranslations } from 'next-intl'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface RulePaginationProps {
  currentPage: number
  totalPages: number
  totalDocs: number
  onPageChange: (page: number) => void
}

export function RulePagination({
  currentPage,
  totalPages,
  totalDocs,
  onPageChange,
}: RulePaginationProps) {
  const t = useTranslations('dashboard.rules')

  if (totalPages <= 1) return null

  return (
    <div className="space-y-2">
      <Pagination className="mx-auto">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(currentPage - 1)
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
                  onPageChange(page)
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
                  onPageChange(currentPage + 1)
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
      
      {totalDocs > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          {t('totalItems', { count: totalDocs })}
        </p>
      )}
    </div>
  )
} 