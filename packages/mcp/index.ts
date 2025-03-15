#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { registerTools, server } from './src/MCP/server.js'
import { logMessage } from './src/utils/logMessage'
import { getPayload } from '@concursor/api'
import { getServerSideURL } from '@concursor/utils'
import { registerResources } from './src/MCP/resource/index.js'

/**
 * Main server startup function
 */
async function main() {
  try {
    registerTools()
    registerResources()
    const transport = new StdioServerTransport()
    await server.connect(transport)
    if (!process.env.API_KEY) {
      throw new Error('API_KEY is not set')
    }
    // 登录态没带上
    const payload = await getPayload(
      getServerSideURL(),
      process.env.API_KEY.trim(),
    )
    const userFromPayload = await payload.auth({
      collection: 'users',
    })

    // 正常带上登录态
    const response = await fetch(`https://www.concursor.com/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `users API-Key ${process.env.API_KEY.trim()}`,
      },
    })
    const user = await response.json()
    logMessage('info', `User: ${user.name}`)

    logMessage('info', '✨MCP Server started successfully')
  } catch (error) {
    logMessage(
      'error',
      `Failed to start server: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    )
    process.exit(1)
  }
}

// Start the server
main().catch((error) => {
  logMessage('error', `Fatal error in main(): ${error}`)
  process.exit(1)
})
