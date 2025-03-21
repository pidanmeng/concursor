import { getRule } from '@/actions/rules'
import { notFound } from 'next/navigation'
import EditRuleClient from './page.client'
import { getTranslations } from 'next-intl/server'
import { NotFound } from '@/components/404'

interface EditRulePageProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default async function EditRulePage({ params }: EditRulePageProps) {
  const { id } = await params
  try {
    const rule = await getRule(id)
    if (!rule) {
      return <NotFound />
    }
    return <EditRuleClient rule={rule} />
  } catch (error) {
    console.error('获取规则失败:', error)
    notFound()
  }
}

// 生成元数据
export async function generateMetadata({ params }: EditRulePageProps) {
  try {
    const { id } = await params
    const rule = await getRule(id)
    const t = await getTranslations('metadata.dashboard')

    return {
      title: `${t('title')} - ${rule?.title || ''}`,
      description: rule?.description || t('description'),
    }
  } catch (error) {
    if (error instanceof Error) {
      notFound()
    }
    // 出错时使用默认元数据
    const t = await getTranslations('metadata.dashboard')
    return {
      title: t('title'),
      description: t('description'),
    }
  }
}
