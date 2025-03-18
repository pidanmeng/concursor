import React from 'react'
import '@/global.css'
import { InitTheme, ThemeProvider } from '@/providers/themeProvider'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserProvider } from '@/providers/userProvider'
import { getThemeServer } from '@/utils/getThemeServer'
import { AuthProvider } from '@/providers/auth-provider'
import { Metadata } from 'next'
import { getUser } from '@/actions/auth'
import { Toaster } from '@/components/ui/sonner'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()

  return {
    title: t('metadata.global.title'),
    description: t('metadata.global.description'),
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: 'en' | 'zh' }>
}) {
  const { locale } = await params
  // 验证 locale 是否有效
  if (!routing.locales.includes(locale)) {
    notFound()
  }

  // 启用静态渲染
  setRequestLocale(locale)

  const messages = await getMessages()

  // 获取用户信息
  const theme = await getThemeServer()
  const user = await getUser()
  const t = await getTranslations()

  return (
    <html lang={locale} suppressHydrationWarning className={theme === 'dark' ? 'dark' : ''}>
      <head>
        <InitTheme />
        <title>{t('metadata.global.title')}</title>
        <meta name="description" content={t('metadata.global.description')} />
      </head>
      <body
        className={cn(
          'min-h-screen h-screen bg-background font-sans antialiased flex flex-col overflow-hidden',
        )}
      >
        <ThemeProvider>
          <UserProvider user={user}>
            <NextIntlClientProvider messages={messages} locale={locale}>
              <AuthProvider>
                {children}
                <Toaster />
                <FlickeringGrid
                  className="fixed inset-0 -z-1 size-full pointer-events-none opacity-10"
                  squareSize={4}
                  gridGap={6}
                  color="#6B7280"
                  maxOpacity={0.5}
                  flickerChance={0.1}
                />
              </AuthProvider>
            </NextIntlClientProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
