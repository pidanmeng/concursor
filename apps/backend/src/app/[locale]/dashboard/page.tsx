import { getDashboardOverview } from '@/actions/dashboard'
import { DashboardContent } from './page.client'
import { Suspense } from 'react'
import { Loading } from '@/components/loading'

/**
 * Dashboard页面服务端组件
 * 
 * 负责从服务器获取数据，并将数据传递给客户端组件
 * 使用Suspense确保页面加载时有良好的用户体验
 */
export default async function Dashboard() {
  // 从服务器获取仪表盘数据
  const { stats, recentRules, recentProjects } = await getDashboardOverview()

  return (
    <Suspense fallback={<Loading />}>
      <DashboardContent 
        stats={stats} 
        recentRules={recentRules} 
        recentProjects={recentProjects} 
      />
    </Suspense>
  )
}
