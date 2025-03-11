import RulesClient from './page.client'
import type { Rule } from '@/payload-types'
import { getUserRules } from '@/actions/rules'

// 服务器端组件：获取初始数据并传递给客户端组件
export default async function Rules() {
  const rulesData = await getUserRules(1, 10)
  
  return (
    <RulesClient 
      initialRules={rulesData.docs} 
      initialTotalPages={rulesData.totalPages}
      initialTotalDocs={rulesData.totalDocs}
    />
  )
}
