'use client'

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Link, usePathname } from '@/i18n/routing'

interface SidebarSectionItem {
  icon: React.ReactNode
  label: string
  href: string
}

interface SidebarSectionProps {
  items: SidebarSectionItem[]
}

export function SidebarSection({ items }: SidebarSectionProps) {
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton tooltip={item.label} asChild isActive={pathname === item.href}>
              <Link href={item.href} className="flex">
                {item.icon}
                {item.label}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
