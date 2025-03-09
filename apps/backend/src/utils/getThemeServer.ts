import { defaultTheme } from '@/providers/themeProvider'
import { cookies, headers } from 'next/headers'

export const getThemeServer = async () => {
  const headersList = await headers()
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme-preference')?.value || ''
  const themePreference = headersList.get('sec-ch-prefers-color-scheme') || ''

  if (themeIsValid(theme)) {
    return theme
  } else if (themeIsValid(themePreference)) {
    return themePreference
  } else {
    return defaultTheme
  }
}

function themeIsValid(theme: string) {
  return theme === 'light' || theme === 'dark'
}
