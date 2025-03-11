import { getRule } from '@/actions/rules'
import { notFound } from 'next/navigation'
import EditRuleClient from './page.client'
import { getTranslations } from 'next-intl/server'
import { redirect } from '@/i18n/routing'

interface EditRulePageProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default async function EditRulePage({ params }: EditRulePageProps) {
  const { id, locale } = await params
  try {
    const rule = await getRule(id)

    return <EditRuleClient rule={rule} />
  } catch (error) {
    console.error('获取规则失败:', error)
    if ((error as any).status === 404) {
      notFound()
    }

    // 重定向回规则列表页
    redirect({
      href: '/dashboard/rules',
      locale,
    })
  }
}

// 生成元数据
export async function generateMetadata({ params }: EditRulePageProps) {
  try {
    const { id } = await params
    const rule = await getRule(id)
    const t = await getTranslations('metadata.dashboard')

    return {
      title: `${t('title')} - ${rule.title}`,
      description: rule.description || t('description'),
    }
  } catch (error) {
    // 出错时使用默认元数据
    const t = await getTranslations('metadata.dashboard')
    return {
      title: t('title'),
      description: t('description'),
    }
  }
}
