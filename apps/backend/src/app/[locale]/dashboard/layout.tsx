import React from 'react'
import '@/global.css'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { headers } from 'next/headers'
import configPromise from '@/payload.config'
import { redirect } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { getUser } from '@/actions/auth'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()

  return {
    title: t('metadata.dashboard.title'),
    description: t('metadata.dashboard.description'),
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const user = await getUser()
  const { locale } = await params

  if (!user) {
    redirect({
      href: '/signin',
      locale: locale,
    })
  }
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="mx-auto flex-1 h-full overflow-hidden justify-center items-center py-2 pr-2 flex flex-col gap-2">
        <DashboardHeader />
        <div
          className={cn(
            'flex-1 bg-primary-foreground rounded-3xl overflow-y-auto h-full w-full flex justify-center',
          )}
        >
          <div className="p-6 space-y-6 w-full 2xl:w-3/4">{children}</div>
        </div>
      </main>
    </SidebarProvider>
  )
}
