import { DashboardData } from '@/actions/dashboard'
import { Project, Rule } from '@/payload-types'
import { atom } from 'jotai'

/**
 * Dashboard状态管理
 * 这些atom用于在组件之间共享状态，避免组件树重新渲染时丢失状态
 */

// 最近的规则列表
export const recentRulesAtom = atom<Rule[]>([])

// 最近的项目列表
export const recentProjectsAtom = atom<Project[]>([])

// 统计数据
export const statsAtom = atom<DashboardData['stats']>({
  rules: { value: 0 },
  favorites: { value: 0 },
  projects: { value: 0 },
}) 