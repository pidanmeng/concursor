import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ModeToggle'
import { LanguageToggle } from '@/components/LanguageToggle'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { AuthButton } from './AuthButton'

function HeaderLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="transition-colors hover:text-foreground/80">
      {children}
    </Link>
  )
}

export function Header() {
  const t = useTranslations()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">ConCursor</span>
          </Link>

          <nav className="flex items-center space-x-6 text-sm font-medium">
            <HeaderLink href="/">{t('nav.home')}</HeaderLink>
            <HeaderLink href="/rules">{t('nav.rules')}</HeaderLink>
            <HeaderLink href="/pricing">{t('nav.pricing')}</HeaderLink>
            <HeaderLink href="/extension">{t('nav.extension')}</HeaderLink>
            <HeaderLink href="/generate">{t('nav.generate')}</HeaderLink>
            <HeaderLink href="/mcp">{t('nav.mcp')}</HeaderLink>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            <LanguageToggle />
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  )
}
