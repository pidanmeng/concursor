import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { ConCursorLogo } from '../concursorLogo'

export function DashboardSidebarHeader() {
  return (
    <SidebarHeader className="border-none flex justify-between items-center flex-row">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="group-data-[collapsible=icon]:bg-amber-200 transition-all duration-300 group-data-[collapsible=icon]:hover:bg-amber-100">
            <ConCursorLogo className="group-data-[collapsible=icon]:text-black transition-all duration-300" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}
