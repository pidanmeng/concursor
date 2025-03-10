import { HeaderToolbar } from '../header-toolbar'
import { SidebarTrigger } from '../ui/sidebar'

export function DashboardHeader() {
  return (
    <header className="flex justify-between items-center flex-row w-full pr-6">
      <SidebarTrigger />
      <HeaderToolbar />
    </header>
  )
}
