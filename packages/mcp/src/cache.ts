import { ref } from '@vue/reactivity'
import type { Project, Rule } from '../../../apps/backend/src/payload-types'
import { getProject as getProjectApi } from './api/getProject'
import { getRule as getRuleApi } from './api/getRule'
import { updateRule as updateRuleApi } from './api/updateRule'

type ID = string
type Cache = {
  project: Record<ID, Project>
  rule: Record<ID, Rule>
}

const cache = ref<Cache>({
  project: {},
  rule: {},
})

export function getCachedProject(id: ID): Project | undefined {
  return cache.value.project[id]
}

export function getCachedRule(id: ID): Rule | undefined {
  return cache.value.rule[id]
}

export function setCachedProject(id: ID, project: Project): void {
  cache.value.project[id] = project
}

export function setCachedRule(id: ID, rule: Rule): void {
  cache.value.rule[id] = rule
}

export function clearCache(): void {
  cache.value = {
    project: {},
    rule: {},
  }
}

export async function getProject(id: ID): Promise<Project> {
  let project = getCachedProject(id)
  if (project) {
    return project
  }
  project = await getProjectApi(id)
  setCachedProject(id, project)

  project.rules?.forEach(async (ruleObj) => {
    if (!ruleObj.rule) {
      return
    }
    if (typeof ruleObj.rule === 'string') {
      await getRule(ruleObj.rule)
      return
    }
    setCachedRule(ruleObj.rule.id, ruleObj.rule)
  })
  return project
}

export async function getRule(id: ID): Promise<Rule> {
  let rule = getCachedRule(id)
  if (rule) {
    return rule
  }
  rule = await getRuleApi(id)
  setCachedRule(id, rule)
  return rule
}

export async function updateRule(id: ID, content: string): Promise<void> {
  await updateRuleApi(id, content)
  setCachedRule(id, {
    ...(await getRule(id)),
    content,
  })
}
