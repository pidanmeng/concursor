'use client'

import { useTranslations } from 'next-intl'
import { SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface RuleSearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearchSubmit: (e: React.FormEvent) => void
}

export function RuleSearchBar({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}: RuleSearchBarProps) {
  const t = useTranslations('dashboard.rules')

  return (
    <form onSubmit={onSearchSubmit} className="flex-1 relative">
      <Input
        type="text"
        placeholder={t('searchPlaceholder')}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pr-10"
      />
      <Button 
        type="submit" 
        size="icon" 
        variant="ghost" 
        className="absolute right-0 top-0 h-full px-3"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
    </form>
  )
} 