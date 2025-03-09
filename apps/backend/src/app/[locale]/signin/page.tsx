import { Metadata } from 'next'
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons'
import { redirect } from '@/i18n/routing'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import SignInPageClient from './page.client'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()

  return {
    title: t('metadata.signin.title'),
    description: t('metadata.signin.description'),
  }
}

export default async function SignInPage({
  searchParams: searchParamsPromise,
  params,
}: {
  searchParams: Promise<{ redirectTo?: string; source?: string }>
  params: Promise<{ locale: string }>
}) {
  const headersList = await headers()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers: headersList })
  const searchParams = await searchParamsPromise
  const { locale } = await params

  if (searchParams.source !== 'extension' && user) {
    redirect({
      href: searchParams.redirectTo || '/',
      locale: locale,
    })
  }

  return <SignInPageClient />
}
