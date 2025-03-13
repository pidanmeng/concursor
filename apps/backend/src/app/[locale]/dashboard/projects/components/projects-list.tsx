'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/common/search-bar'
import { searchProjects, deleteProject, duplicateProject, getProjects } from '@/actions/projects'
import type { Project } from '@/payload-types'
import { ProjectCard } from '@/components/dashboard/project-card'
import { AddProjectCard } from '@/components/dashboard/add-project-card'

interface ProjectsListProps {
  initialProjects: Project[]
  initialSearchQuery?: string
  totalPages: number
  currentPage: number
  hasNextPage: boolean
}

export function ProjectsList({ 
  initialProjects, 
  initialSearchQuery = '', 
  currentPage,
  hasNextPage 
}: ProjectsListProps) {
  const t = useTranslations('dashboard.projects')
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [searchResults, setSearchResults] = useState<Project[]>(
    initialSearchQuery ? initialProjects : [],
  )
  const [isSearching, setIsSearching] = useState(Boolean(initialSearchQuery))
  const [currentPageState, setCurrentPageState] = useState(currentPage)
  const [hasNextPageState, setHasNextPageState] = useState(hasNextPage)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  
  const observerTarget = useRef<HTMLDivElement>(null)
  
  // 加载更多项目
  const loadMoreProjects = useCallback(async () => {
    if (!hasNextPageState || isLoadingMore) return

    try {
      setIsLoadingMore(true)
      const nextPage = currentPageState + 1

      if (isSearching) {
        const searchData = await searchProjects(searchQuery, { page: nextPage })
        setSearchResults(prev => [...prev, ...searchData.docs])
        setHasNextPageState(searchData.hasNextPage)
        setCurrentPageState(searchData.page)
      } else {
        const projectsData = await getProjects({ page: nextPage })
        setProjects(prev => [...prev, ...projectsData.docs])
        setHasNextPageState(projectsData.hasNextPage)
        setCurrentPageState(projectsData.page)
      }
    } catch (error) {
      console.error('加载更多项目失败:', error)
      toast.error(t('loadMoreError'))
    } finally {
      setIsLoadingMore(false)
    }
  }, [hasNextPageState, isLoadingMore, currentPageState, isSearching, searchQuery, t])

  // 处理触底加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasNextPageState && !isLoadingMore) {
          loadMoreProjects()
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasNextPageState, isLoadingMore, currentPageState, searchQuery, isSearching, loadMoreProjects])

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

        // 使用URL参数进行搜索，这样可以在刷新页面时保持搜索结果
        router.push(`/dashboard/projects?q=${encodeURIComponent(searchQuery)}&page=1`)

        // 搜索第一页结果
        const results = await searchProjects(searchQuery, { page: 1 })
        setSearchResults(results.docs)
        setCurrentPageState(results.page)
        setHasNextPageState(results.hasNextPage)
        setIsSearching(true)
      } catch (error) {
        console.error('搜索项目失败:', error)
        toast.error(t('searchError'))
      }
    },
    [searchQuery, t, router],
  )

  // 重置搜索
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value)

      // 如果搜索框被清空，重置搜索状态并更新URL
      if (!value.trim() && isSearching) {
        setIsSearching(false)
        router.push('/dashboard/projects')
      }
    },
    [isSearching, router],
  )

  // 处理删除
  const handleDelete = useCallback(
    async (id: string) => {
      try {

        // 更新本地状态
        setProjects((prev) => prev.filter((project) => project.id !== id))
        if (isSearching) {
          setSearchResults((prev) => prev.filter((project) => project.id !== id))
        }

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
      }
    },
    [isSearching, searchResults.length, router],
  )

  // 处理复制
  const handleDuplicate = useCallback(
    async (project: Project) => {
      try {

        // 更新本地状态
        setProjects((prev) => [project, ...prev])

        // 刷新页面以获取最新数据
        router.refresh()

        return project
      } catch (error) {
        console.error('复制项目失败:', error)
        throw error
      }
    },
    [router],
  )

  // 处理恢复
  const handleRestore = useCallback(
    async (project: Project) => {
      // 更新本地状态
      setProjects((prev) => [project, ...prev])

      // 刷新页面以获取最新数据
      router.refresh()
    },
    [router],
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onRestore={handleRestore}
              />
            ))}
            <AddProjectCard />
          </div>
          
          {/* 触底加载指示器 */}
          {hasNextPageState && (
            <div 
              ref={observerTarget} 
              className="py-4 flex justify-center"
            >
              {isLoadingMore && (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t('loadingMore')}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
