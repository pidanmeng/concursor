import { Sidebar, SidebarContent } from '@/components/ui/sidebar'
import { DashboardSidebarHeader } from './sidebar-header'
import { SidebarSection } from './sidebar-section'
import { PanelLeft, Settings, Star, Folder } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function DashboardSidebar() {
  const t = await getTranslations()

  const sidebarItems = [
    {
      icon: <PanelLeft />,
      label: t('sidebar.dashboard'),
      href: '/dashboard',
    },
    {
      icon: <Settings />,
      label: t('sidebar.rules'),
      href: '/dashboard/rules',
    },
    {
      icon: <Star />,
      label: t('sidebar.favorites'),
      href: '/dashboard/favorites',
    },
    {
      icon: <Folder />,
      label: t('sidebar.projects'),
      href: '/dashboard/projects',
    },
  ]
  return (
    <Sidebar className="border-none" collapsible="icon">
      <DashboardSidebarHeader />
      <SidebarContent>
        <SidebarSection items={sidebarItems} />
      </SidebarContent>
    </Sidebar>
  )
}
