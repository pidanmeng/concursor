'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

import Script from 'next/script'

export const defaultTheme = 'system'
export const themeKey = 'theme-preference'
type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem(themeKey) as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

    const handleThemeChange = () => {
      if (theme === 'system') {
        document.documentElement.classList.toggle('dark', prefersDark.matches)
      }
    }

    // 监听系统主题变化
    prefersDark.addListener(handleThemeChange)

    // 根据当前主题设置应用样式
    if (theme === 'system') {
      document.documentElement.classList.toggle('dark', prefersDark.matches)
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }

    localStorage.setItem(themeKey, theme)

    document.cookie = `${themeKey}=${theme};path=/`

    return () => {
      prefersDark.removeListener(handleThemeChange)
    }
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const InitTheme: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    function getImplicitPreference() {
      var mediaQuery = '(prefers-color-scheme: dark)'
      var mql = window.matchMedia(mediaQuery)
      var hasImplicitPreference = typeof mql.matches === 'boolean'

      if (hasImplicitPreference) {
        return mql.matches ? 'dark' : 'light'
      }

      return null
    }

    function themeIsValid(theme) {
      return theme === 'light' || theme === 'dark'
    }

    var themeToSet = '${defaultTheme}'
    var preference = window.localStorage.getItem('${themeKey}')

    if (themeIsValid(preference)) {
      themeToSet = preference
    } else {
      var implicitPreference = getImplicitPreference()

      if (implicitPreference) {
        themeToSet = implicitPreference
      }
    }

    document.documentElement.classList.toggle('dark', themeToSet === 'dark')
  })();
  `,
      }}
      id="theme-script"
      strategy="beforeInteractive"
    />
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
