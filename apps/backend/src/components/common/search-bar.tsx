'use client'

import { useTranslations } from 'next-intl'
import { SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearchSubmit: (e: React.FormEvent) => void
  placeholderKey?: string
  translationNamespace?: string
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  placeholderKey = 'searchPlaceholder',
  translationNamespace = 'dashboard.common',
}: SearchBarProps) {
  const t = useTranslations(translationNamespace)

  return (
    <form onSubmit={onSearchSubmit} className="flex-1 relative">
      <Input
        type="text"
        placeholder={t(placeholderKey)}
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