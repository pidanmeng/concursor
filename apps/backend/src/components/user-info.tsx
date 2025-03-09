'use client'

import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'

export function UserInfo() {
  const { user, isLoading } = useAuth()
  const t = useTranslations()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src={user.image || ''} alt={user.name || ''} />
        <AvatarFallback>
          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{user.name}</span>
        <span className="text-xs text-muted-foreground">{user.email}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: '/signin' })}
      >
        {t('auth.signOut')}
      </Button>
    </div>
  )
} 