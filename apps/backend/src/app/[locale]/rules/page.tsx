import { getRules } from '@/actions/rules'
import { RulesList } from './components/rules-list'
import { Header } from '@/components/Header'
import { getTranslations } from 'next-intl/server'

interface RulesPageProps {
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}

export default async function RulesPage({ searchParams }: RulesPageProps) {
  const { query = '', page = '1' } = await searchParams
  const limit = 24

  const rules = await getRules(Number(page), limit, query)
  const t = await getTranslations('rules')

  return (
    <>
      <Header />
      <main className="container mx-auto flex-1 h-full">
        <h1 className="my-8 text-2xl font-bold">{t('title')}</h1>
        <RulesList initialData={rules} />
      </main>
    </>
  )
}
