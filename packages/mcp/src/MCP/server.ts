import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import PackageJson from '../../package.json'

export { registerTools } from './tool'
export const server = new McpServer({
  name: 'Concursor MCP Server',
  version: PackageJson.version,
})


