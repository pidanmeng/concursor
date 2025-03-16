import { z } from 'zod'
import { getProject } from '../../cache'
import type { Project } from '../../../../../apps/backend/src/payload-types'
import { registerTool } from '.'
import { logMessage } from '../../utils/logMessage'
import {
  GET_RULE_TOOL_NAME,
  GET_RULES_TOOL_NAME,
  UPDATE_RULES_TOOL_NAME,
} from './rules'

const getProjectDetailToolName = 'get_project_detail'

const getProjectDetailToolDescription = `Get Project Details and Rules Guidelines

This tool retrieves detailed information about a specified project from Concursor, including project descriptions and best practice rules to help you understand the project architecture and coding requirements.

Parameters:
- projectId: The project ID used to retrieve specific project details

Returns:
- Project Details: Background, objectives, and architectural description of the project
- Rules Summary: Overview of all rules relevant to the project
- Task Execution Process: Guidance on how to use rules at different stages of a task
- Key Notes: Critical advice on rule usage and updates

Please read the returned project details and rules summary before starting the task, and use the concursor ${GET_RULES_TOOL_NAME} tool to retrieve specific rules relevant to your current task.
After completing the task, please submit rule improvement suggestions using the concursor update_rules tool.
`

function generateRuleSummary(
  rule: NonNullable<Project['rules']>[number],
): string {
  if (typeof rule.rule === 'string' || !rule.rule) {
    return ''
  }
  logMessage('info', JSON.stringify(rule, null, 2))
  const ruleTitle = rule.alias || rule.rule.title || 'unknown'
  return `
## ${ruleTitle} - id: ${rule.rule.id}

### Rule Description:
${rule.rule.description}

### Scope:
${rule.rule.globs || 'All files'}

### Usage Guide:
- Get complete rule using tool: \`concursor ${GET_RULES_TOOL_NAME} --rule_id="${
    rule.rule.id
  }"\`

`
}

function generateProjectDetail(project: Project): string {
  return `
# Project Details:

${project.description}

# Rules Summary:

${project.rules?.map(generateRuleSummary).join('\n')}

# Task Execution Process:

## 1. Preparation Phase:
- Carefully read the project details and rules summary above to ensure you understand the background and objectives
- Use the \`concursor ${GET_RULE_TOOL_NAME}\` tool when you need detailed information about a specific rule: \`concursor ${GET_RULE_TOOL_NAME} --rule_id="rule123"\`
- Use the \`concursor ${GET_RULES_TOOL_NAME}\` tool to retrieve details for multiple rules at once: \`concursor ${GET_RULES_TOOL_NAME} --rule_ids=["rule123", "rule456"]\`
- Read and analyze the retrieved rules to understand how they apply to your current task

## 2. Execution Phase:
- Before writing code, list the specific rule points you will follow
- Ensure strict adherence to relevant rules when writing code
- When rules may conflict, prioritize more specific rules or newer rules
- If you need details about additional rules, use the \`concursor ${GET_RULE_TOOL_NAME}\` or \`concursor ${GET_RULES_TOOL_NAME}\` tools

## 3. Reflection Phase:
- After completing your code, review whether your implementation complies with all relevant rules
- Reflect on difficulties encountered, rule gaps, or contradictions discovered during task execution
- If you've identified improvements to a rule, use the \`concursor ${UPDATE_RULES_TOOL_NAME}\` tool to update its content:
  * Add clarity to ambiguous rules
  * Provide specific code examples
  * Enhance explanations with best practices
  * Update outdated information

- Always understand the project and relevant rules before starting to write code
- Use the following tools effectively:
  * \`concursor ${GET_RULE_TOOL_NAME}\` - Get detailed information about a specific rule by ID
  * \`concursor ${GET_RULES_TOOL_NAME}\` - Retrieve details for multiple rules at once by IDs
  * \`concursor ${UPDATE_RULES_TOOL_NAME}\` - Update rule content with improvements
- Ask specific questions when rules are ambiguous or missing
- Each rule update should include comprehensive content with examples and rationale

Remember: Rules are dynamically refined, and your contributions will help improve the project's development process and code quality.

`
}

/**
 * 注册获取项目详情工具
 *
 * @description 获取项目详情工具，获取项目详情和项目规则
 * @param projectId - 项目ID
 * @returns 项目详情和项目规则
 */
export function registerGetProjectDetailTool() {
  registerTool({
    name: getProjectDetailToolName,
    description: getProjectDetailToolDescription,
    parameters: {
      projectId: z.string(),
    },
    cb: async ({ projectId }) => {
      const project = await getProject(projectId)
      return {
        content: [
          {
            type: 'text',
            text: generateProjectDetail(project),
          },
        ],
      }
    },
  })
}
