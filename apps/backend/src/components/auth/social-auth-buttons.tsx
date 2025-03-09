'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useTranslations } from 'next-intl'
import { signIn } from 'next-auth/react'

export function SocialAuthButtons() {
  const t = useTranslations()

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      await signIn(provider, { callbackUrl: '/' })
    } catch (error) {
      console.error(`Failed to sign in with ${provider}:`, error)
    }
  }

  return (
    <div className="grid gap-4">
      <Button variant="outline" type="button" onClick={() => handleSocialLogin('google')}>
        <Icons.google className="mr-2 h-4 w-4" />
        {t('auth.continueWithGoogle')}
      </Button>
      <Button variant="outline" type="button" onClick={() => handleSocialLogin('github')}>
        <Icons.gitHub className="mr-2 h-4 w-4" />
        {t('auth.continueWithGithub')}
      </Button>
    </div>
  )
}
