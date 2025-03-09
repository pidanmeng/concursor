'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from 'next-auth/react'
import { useUser } from '@/providers/userProvider'
import { useTranslations } from 'next-intl'
import { Button } from './ui/button'
import { Link } from '@/i18n/routing'

export function AuthButton() {
  const { user } = useUser()
  const t = useTranslations()

  if (!user) {
    return (
      <Button size="sm" asChild>
        <Link href="/signin">{t('nav.signin')}</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarImage src={user.image || ''} alt={user.name || ''} />
          <AvatarFallback>
            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/signin' })}>
          {t('auth.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

