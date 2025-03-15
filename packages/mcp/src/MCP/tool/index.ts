import { z } from 'zod'
import { server } from '../server'
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js'

type MCPTool<T extends z.ZodRawShape> = {
  name: string
  description: string
  parameters: T
  cb: ToolCallback<T>
}

function registerTool<T extends z.ZodRawShape>(tool: MCPTool<T>): void {
  server.tool(tool.name, tool.description, tool.parameters, tool.cb)
}

export function registerTools(): void {
  registerTool({
    name: 'add',
    description: 'Add two numbers',
    parameters: { a: z.number(), b: z.number() },
    cb: async ({ a, b }) => ({
      content: [{ type: 'text', text: String(a + b) }],
    }),
  })
}
