import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'

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

// API v1 routes will be registered here
app.get('/api/v1', async () => ({
  name: 'ARCA Fund Platform API',
  version: '0.0.1',
}))

const port = Number(process.env.PORT ?? 4000)
const host = process.env.HOST ?? '0.0.0.0'

try {
  await app.listen({ port, host })
  app.log.info(`Server running at http://${host}:${port}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
