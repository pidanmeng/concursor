import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const locales = ['en', 'zh'] as const

// 语言名称显示配置
export const LANGUAGE_LABELS: Record<typeof locales[number], string> = {
  zh: '中文',
  en: 'English',
}

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
