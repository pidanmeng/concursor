'use client'

import { useState } from 'react'
import { XIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export interface TagItem {
  id: string
  name: string
}

interface TagInputProps {
  placeholder?: string
  tags: TagItem[]
  setTags: (tags: TagItem[]) => void
}

export function TagInput({ 
  placeholder = '输入标签，按回车添加', 
  tags, 
  setTags 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  // 添加标签
  const handleAddTag = () => {
    const trimmedValue = inputValue.trim()
    if (!trimmedValue) return
    
    // 检查是否已存在相同标签
    const exists = tags.some(tag => tag.name.toLowerCase() === trimmedValue.toLowerCase())
    if (exists) {
      setInputValue('')
      return
    }
    
    // 添加新标签
    const newTag: TagItem = {
      id: trimmedValue,  // 使用标签名作为ID
      name: trimmedValue
    }
    
    setTags([...tags, newTag])
    setInputValue('')
  }

  // 删除标签
  const handleRemoveTag = (index: number) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    setTags(newTags)
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // 如果输入框为空，且存在标签，则删除最后一个标签
      handleRemoveTag(tags.length - 1)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10">
      {/* 已选标签 */}
      {tags.map((tag, index) => (
        <Badge 
          key={`${tag.id}-${index}`} 
          variant="secondary"
          className="text-xs gap-1 px-2 py-1"
        >
          {tag.name}
          <button
            type="button"
            onClick={() => handleRemoveTag(index)}
            className="hover:bg-accent rounded-full p-1"
          >
            <XIcon className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      {/* 输入框 */}
      <Input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleAddTag}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7 min-w-[120px] flex-1"
      />
    </div>
  )
} 