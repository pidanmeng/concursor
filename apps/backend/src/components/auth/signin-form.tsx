'use client'

import { useTranslations } from 'next-intl'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Icons } from '@/components/icons'
import { SocialAuthButtons } from './social-auth-buttons'

export function SignInForm() {
  const t = useTranslations()


  return (
    <Card className="w-full sm:w-[350px]">
      <CardHeader className="space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">{t('auth.welcomeBack')}</h1>
        <p className="text-sm text-muted-foreground">{t('auth.loginWithSocial')}</p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SocialAuthButtons />
      </CardContent>
    </Card>
  )
}
