import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import { trlRoutes } from './routes/trl.js'
import { memoRoutes } from './routes/memos.js'
import { complianceRoutes } from './routes/compliance.js'
import { dataRoomRoutes } from './routes/dataroom.js'

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
})

await app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
})

await app.register(helmet)

// Health check
app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: '0.0.1',
}))

// API v1 routes
app.get('/api/v1', async () => ({
  name: 'ARCA Fund Platform API',
  version: '0.0.1',
}))

await app.register(trlRoutes)
await app.register(memoRoutes)
await app.register(complianceRoutes)
await app.register(dataRoomRoutes)

const port = Number(process.env.PORT ?? 4000)
const host = process.env.HOST ?? '0.0.0.0'

try {
  await app.listen({ port, host })
  app.log.info(`Server running at http://${host}:${port}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
