import { z } from 'zod'
import { server } from '../server'
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerGetProjectDetailTool } from './getProjectDetail'
import { registerRulesTools } from './rules'

type MCPTool<T extends z.ZodRawShape> = {
  name: string
  description: string
  parameters: T
  cb: ToolCallback<T>
}

export function registerTool<T extends z.ZodRawShape>(tool: MCPTool<T>): void {
  server.tool(tool.name, tool.description, tool.parameters, tool.cb)
}

export function registerTools(): void {
  registerGetProjectDetailTool()
  registerRulesTools()
}
