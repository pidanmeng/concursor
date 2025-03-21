import { z } from 'zod'
import { registerTool } from '.'
import { logMessage } from '../../utils/logMessage'
import { getRule, updateRule, getOwnedRules } from '../../cache'
import type { Rule } from '../../../../../apps/backend/src/payload-types'

export const GET_RULES_TOOL_NAME = 'get_rules'
export const GET_RULE_TOOL_NAME = 'get_rule'
export const UPDATE_RULES_TOOL_NAME = 'update_rules'
export const GET_OWNED_RULES_TOOL_NAME = 'get_owned_rules'
/**
 * Tool description for get_rules
 */
const GET_RULES_TOOL_DESCRIPTION = `Retrieve multiple rules by their IDs.

This tool allows you to fetch details for multiple rules at once by providing their rule IDs.

Returns:
- Detailed information about each requested rule
- Empty result if no matching rules are found

`

/**
 * Tool description for get_rule
 */
const GET_RULE_TOOL_DESCRIPTION = `Retrieve a specific rule by its ID to get detailed information.

This tool allows you to fetch a single rule using its unique ID when you need to understand a specific standard or best practice in detail.

Returns:
- Detailed information about the requested rule, including its description, scope, and content
- Error message if the rule is not found

`

/**
 * Tool description for update_rules
 */
const UPDATE_RULES_TOOL_DESCRIPTION = `Update the content of an existing rule with new information or insights.

This tool helps improve the project's rule system by allowing you to update the content of an existing rule after completing a task and gaining new insights.

Returns:
- Confirmation of your rule update submission
- A unique identifier for tracking your update

`

/**
 * Tool description for get_owned_rules
 */
const GET_OWNED_RULES_TOOL_DESCRIPTION = `Retrieve all rules created by the current user.

Returns:
- All rules from the database
`

/**
 * Format rule details for display
 */
function formatRuleDetails(rule: Rule): string {
  return `
# ${rule.title} (ID: ${rule.id})

## Description
${rule.description || 'No description provided'}

## Scope
${
  rule.globs
    ? typeof rule.globs === 'string'
      ? rule.globs
      : 'All files'
    : 'All files'
}

${
  rule.content
    ? `
## Rule Content
${rule.content}
`
    : ''
}

`
}

/**
 * Register the get_rules tool
 */
export function registerGetRulesTool() {
  registerTool({
    name: GET_RULES_TOOL_NAME,
    description: GET_RULES_TOOL_DESCRIPTION,
    parameters: {
      rule_ids: z
        .array(z.string())
        .describe('The rule IDs used to retrieve specific rules'),
    },
    cb: async ({ rule_ids }) => {
      try {
        logMessage(
          'info',
          `Retrieving rules with IDs: [${rule_ids.join(', ')}]`,
        )
        // Get rules by IDs
        const rules: Rule[] = []
        for (const id of rule_ids) {
          try {
            const rule = await getRule(id)
            if (rule) {
              rules.push(rule)
            }
          } catch (error) {
            logMessage('error', `Failed to get rule with ID ${id}: ${error}`)
          }
        }

        if (rules.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No rules found with the provided IDs`,
              },
            ],
          }
        }

        const formattedRules = rules.map(formatRuleDetails).join('\n---\n')
        return {
          content: [
            {
              type: 'text',
              text: `# Retrieved Rules\n\n${formattedRules}`,
            },
          ],
        }
      } catch (error) {
        logMessage('error', `Error in get_rules: ${error}`)
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving rules: ${error}`,
            },
          ],
        }
      }
    },
  })
}

/**
 * Register the get_rule tool
 */
export function registerGetRuleTool() {
  registerTool({
    name: GET_RULE_TOOL_NAME,
    description: GET_RULE_TOOL_DESCRIPTION,
    parameters: {
      rule_id: z
        .string()
        .describe('The rule ID used to retrieve specific rule'),
    },
    cb: async ({ rule_id }) => {
      try {
        logMessage('info', `Retrieving rule with ID: ${rule_id}`)

        const rule = await getRule(rule_id)

        if (!rule) {
          return {
            content: [
              {
                type: 'text',
                text: `No rule found with ID: ${rule_id}`,
              },
            ],
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: formatRuleDetails(rule),
            },
          ],
        }
      } catch (error) {
        logMessage('error', `Error in get_rule: ${error}`)
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving rule: ${error}`,
            },
          ],
        }
      }
    },
  })
}

/**
 * Register the update_rules tool
 */
export function registerUpdateRulesTool() {
  registerTool({
    name: UPDATE_RULES_TOOL_NAME,
    description: UPDATE_RULES_TOOL_DESCRIPTION,
    parameters: {
      rule_id: z.string().describe('The rule ID used to update specific rule'),
      content: z
        .string()
        .describe(
          'New or updated content for the rule, !IMPORTANT: It will replace the existing content of the rule, so be sure to include all the content you want to keep.',
        ),
    },
    cb: async ({ rule_id, content }) => {
      try {
        // Log the update request
        logMessage('info', `Rule update request: rule_id=${rule_id}`)

        // Here you would typically communicate with your backend service
        // to submit the rule update. For now, we'll simulate a successful submission.
        const updatedRule = await updateRule(rule_id, content)

        // Construct response message
        if (updatedRule.id) {
          let responseText = `Rule Content Updated Successfully`
          return {
            content: [
              {
                type: 'text',
                text: responseText,
              },
            ],
          }
        } else {
          throw new Error('Failed to update rule')
        }
      } catch (error) {
        logMessage('error', `Error in update_rules: ${error}`)
        return {
          content: [
            {
              type: 'text',
              text: `Error updating rule: ${error}`,
            },
          ],
        }
      }
    },
  })
}

/**
 * Register the get_all_rules tool
 */
export function registerGetOwnedRulesTool() {
  registerTool({
    name: GET_OWNED_RULES_TOOL_NAME,
    description: GET_OWNED_RULES_TOOL_DESCRIPTION,
    parameters: {},
    cb: async () => {
      try {
        const rules = await getOwnedRules()
        logMessage('info', JSON.stringify(rules, null, 2))
        return {
          content: [
            {
              type: 'text',
              text: `All rules: ${rules
                .map(formatRuleDetails)
                .join('\n---\n')}`,
            },
          ],
        }
      } catch (error) {
        logMessage('error', `Error in get_all_rules: ${error}`)
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving all rules: ${error}`,
            },
          ],
        }
      }
    },
  })
}
/**
 * Register all rules-related tools
 */
export function registerRulesTools() {
  registerGetRulesTool()
  registerGetRuleTool()
  registerUpdateRulesTool()
  registerGetOwnedRulesTool()
}
