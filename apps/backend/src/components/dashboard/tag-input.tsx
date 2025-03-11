'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/Logos'
import { X, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Tag, TagsSearch } from '@/payload-types'
import { cn } from '@/lib/utils'
import { getPayload } from '@concursor/api'
import { COLLECTION_SLUGS } from '@/constants/collectionSlugs'

// Tag对象结构
export interface TagItem {
  id: string
  name: string
}

export interface TagInputProps {
  value: TagItem[]
  onChange: (value: TagItem[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TagInput({
  value = [],
  onChange,
  placeholder,
  disabled = false,
  className,
}: TagInputProps) {
  const t = useTranslations('dashboard.addRule.form')
  const [inputValue, setInputValue] = useState('')
  const [searchResults, setSearchResults] = useState<TagsSearch[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchResultsRef = useRef<HTMLDivElement>(null)

  const formattedInputValue = useMemo(() => inputValue.trim(), [inputValue])
  const isNewTag = useMemo(
    () => !searchResults.find((tagSearch) => tagSearch.name === formattedInputValue),
    [searchResults, formattedInputValue],
  )

  // 搜索标签
  useEffect(() => {
    setIsSearching(true)
    const searchTags = async () => {
      if (!formattedInputValue) {
        setSearchResults([])
        return
      }

      try {
        // 调用API搜索标签
        const response = await fetch(
          `/api/tags/search?q=${encodeURIComponent(formattedInputValue)}`,
        )
        const data = await response.json()
        setSearchResults(data.docs || [])
      } catch (error) {
        console.error('Error searching tags:', error)
        setSearchResults([])
      }
    }

    const debounce = setTimeout(async () => {
      if (formattedInputValue) {
        await searchTags()
      } else {
        setSearchResults([])
      }
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(debounce)
  }, [formattedInputValue])

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 添加标签
  const addTag = (tagItem: TagItem) => {
    if (tagItem && !value.some((item) => item.id === tagItem.id)) {
      onChange([...value, tagItem])
    }
    setInputValue('')
    inputRef.current?.focus()
  }

  // 移除标签
  const removeTag = (tagId: string) => {
    onChange(value.filter((tag) => tag.id !== tagId))
  }

  // 创建新标签
  const createNewTag = async () => {
    if (!formattedInputValue) return

    try {
      // 使用API创建新标签
      const payload = getPayload()
      const result = await payload.create({
        collection: COLLECTION_SLUGS.TAGS,
        data: {
          name: formattedInputValue,
        },
      })

      // 创建成功后添加到选中的标签列表
      if (result && result.doc) {
        const newTag = result.doc as Tag
        addTag({
          id: newTag.id,
          name: newTag.name,
        })
      }
    } catch (error) {
      console.error('Error creating tag:', error)
    }
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (formattedInputValue) {
        if (isNewTag) {
          createNewTag()
        } else if (searchResults.length > 0) {
          // 选择第一个搜索结果
          const firstResult = searchResults[0]
          const tagDoc = firstResult.doc.value as Tag
          addTag({
            id: tagDoc.id,
            name: firstResult.name,
          })
        }
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1].id)
    }
  }

  return (
    <div className="relative w-full">
      <div
        className={cn(
          'flex flex-wrap gap-1.5 p-1.5 border rounded-md bg-background min-h-10',
          isFocused && 'ring-1 ring-ring',
          disabled && 'opacity-50 pointer-events-none',
          className,
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="flex items-center gap-1 text-sm py-0.5 px-2"
          >
            <Logo name={tag.name} className="h-3 w-3" />
            {tag.name}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(tag.id)
              }}
              className="ml-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : undefined}
          disabled={disabled}
          className="flex-1 border-0 p-0 pl-1 bg-transparent text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 min-w-20"
        />
      </div>

      {isFocused && (searchResults.length > 0 || formattedInputValue) && (
        <div
          ref={searchResultsRef}
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md bg-popover shadow-md"
        >
          <div className="p-1">
            {isSearching ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">{t('searching')}...</div>
            ) : (
              <>
                {searchResults.map((tagSearch) => (
                  <div
                    key={tagSearch.id}
                    className="flex items-center px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm"
                    onClick={() =>
                      addTag({
                        id:
                          typeof tagSearch.doc.value === 'string'
                            ? tagSearch.doc.value
                            : tagSearch.doc.value.id,
                        name: tagSearch.name,
                      })
                    }
                  >
                    <Logo name={tagSearch.name} className="mr-2 h-4 w-4" />
                    {tagSearch.name}
                  </div>
                ))}
                {formattedInputValue && isNewTag && !isSearching && (
                  <div
                    className="flex items-center justify-between px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm"
                    onClick={createNewTag}
                  >
                    <span>&quot;{formattedInputValue}&quot;</span>
                    <Plus className="h-3 w-3" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
