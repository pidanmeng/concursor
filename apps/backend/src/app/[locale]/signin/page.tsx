'use server'

import { Metadata } from 'next'
import { redirect } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import SignInPageClient from './page.client'
import { Header } from '@/components/Header'
import { getUser } from '@/actions/auth'

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
  const user = await getUser()
  const searchParams = await searchParamsPromise
  const { locale } = await params

  if (searchParams.source !== 'extension' && user) {
    redirect({
      href: searchParams.redirectTo || '/',
      locale: locale,
    })
  }

  return (
    <>
      <Header />
      <main className="container mx-auto flex-1 h-full">
        <SignInPageClient />
      </main>
    </>
  )
}
