import * as net from 'node:net'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { ref } from 'reactive-vscode'
import { saveApiKey } from '../auth/storage'
import { logger } from '../utils'

const app = new Hono()

app.use(
  '/*',
  cors({
    origin: 'http://localhost:3000',
  }),
)

app.get('/', (c) => {
  logger.info(c.req.header(), null, 2)
  return c.text('Hello ConCursor!')
})

app.get('/connect-to-concursor', (c) => {
  return c.json({
    success: true,
  })
})

app.post('/auth', async (c) => {
  try {
    const { apiKey } = await c.req.json()

    if (!apiKey) {
      return c.json({ success: false, error: 'API key is required' }, 400)
    }

    await saveApiKey(apiKey)

    return c.json({ success: true })
  }
  catch (error) {
    logger.error('Auth error:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

// 检查端口是否可用的函数
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.listen(port, '127.0.0.1', () => {
      server.close(() => {
        resolve(true)
      })
    })
    server.on('error', () => {
      resolve(false)
    })
  })
}

// 查找可用端口的函数
async function findAvailablePort(
  startPort: number,
  endPort: number,
): Promise<number> {
  for (let port = startPort; port <= endPort; port++) {
    if (await isPortAvailable(port)) {
      return port
    }
  }
  throw new Error('No available ports found')
}

export const port = ref<number>(55888)

export async function startServer() {
  try {
    port.value = await findAvailablePort(55888, 60000)
    serve(
      {
        fetch: app.fetch,
        port: port.value,
      },
      (info) => {
        logger.info(`Server is running on http://localhost:${info.port}`)
      },
    )
  }
  catch (error) {
    logger.error('Failed to start server:', error)
  }
}

export function getLocalServerUrl() {
  return `http://localhost:${port.value}`
}
