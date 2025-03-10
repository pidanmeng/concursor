import { getDashboardOverview } from '@/actions/dashboard'
import { DashboardContent } from './page.client'


export default async function Dashboard() {
  const { stats, recentRules, recentProjects } = await getDashboardOverview()

  return (
    <DashboardContent 
      stats={stats} 
      recentRules={recentRules} 
      recentProjects={recentProjects} 
    />
  )
}
