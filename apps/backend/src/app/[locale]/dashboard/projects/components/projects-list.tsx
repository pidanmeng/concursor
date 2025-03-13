'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/common/search-bar'
import { searchProjects, deleteProject, duplicateProject } from '@/actions/projects'
import type { Project } from '@/payload-types'
import { ProjectCard } from '@/components/dashboard/project-card'
import { AddProjectCard } from '@/components/dashboard/add-project-card'

interface ProjectsListProps {
  initialProjects: Project[]
  initialSearchQuery?: string
}

export function ProjectsList({ initialProjects, initialSearchQuery = '' }: ProjectsListProps) {
  const t = useTranslations('dashboard.projects')
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [searchResults, setSearchResults] = useState<Project[]>(initialSearchQuery ? initialProjects : [])
  const [isSearching, setIsSearching] = useState(Boolean(initialSearchQuery))
  const [isLoading, setIsLoading] = useState(false)

  // 搜索项目 - 客户端搜索
  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      
      // 如果搜索框为空，重置搜索状态
      if (!searchQuery.trim()) {
        setIsSearching(false)
        return
      }

      try {
        setIsLoading(true)
        
        // 使用URL参数进行搜索，这样可以在刷新页面时保持搜索结果
        router.push(`/dashboard/projects?q=${encodeURIComponent(searchQuery)}`)
        
        // 仅当搜索结果变化时才更新
        const results = await searchProjects(searchQuery)
        setSearchResults(results)
        setIsSearching(true)
      } catch (error) {
        console.error('搜索项目失败:', error)
        toast.error(t('searchError'))
      } finally {
        setIsLoading(false)
      }
    },
    [searchQuery, t, router],
  )

  // 重置搜索
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    
    // 如果搜索框被清空，重置搜索状态并更新URL
    if (!value.trim() && isSearching) {
      setIsSearching(false)
      router.push('/dashboard/projects')
    }
  }, [isSearching, router])

  // 处理删除
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteProject(id)
        
        // 更新本地状态
        setProjects((prev) => prev.filter((project) => project.id !== id))
        if (isSearching) {
          setSearchResults((prev) => prev.filter((project) => project.id !== id))
        }
        
        // 成功提示
        toast.success(t('deleteSuccess'))
        
        // 如果删除后列表为空且正在搜索，则返回到全部项目页面
        if (isSearching && searchResults.length <= 1) {
          setIsSearching(false)
          setSearchQuery('')
          router.push('/dashboard/projects')
        } else {
          // 刷新页面以获取最新数据
          router.refresh()
        }
      } catch (error) {
        console.error('删除项目失败:', error)
        toast.error(t('deleteFailed'))
      }
    },
    [isSearching, searchResults.length, router, t],
  )

  // 处理复制
  const handleDuplicate = useCallback(
    async (id: string) => {
      try {
        const newProject = await duplicateProject(id)
        
        // 更新本地状态
        setProjects((prev) => [newProject, ...prev])
        
        // 成功提示
        toast.success(t('duplicateSuccess'))
        
        // 刷新页面以获取最新数据
        router.refresh()
        
        return newProject
      } catch (error) {
        console.error('复制项目失败:', error)
        toast.error(t('duplicateFailed'))
        throw error
      }
    },
    [router, t],
  )

  // 显示的项目列表
  const displayedProjects = isSearching ? searchResults : projects

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearch}
          placeholderKey="searchPlaceholder"
          translationNamespace="dashboard.projects"
        />
        <Button onClick={() => router.push('/dashboard/projects/new')}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addProject')}
        </Button>
      </div>

      {isSearching && searchResults.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t('noSearchResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AddProjectCard />
          
          {displayedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  )
} 