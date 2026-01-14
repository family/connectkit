import { toNodeHandler } from 'better-auth/node'
import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
import { auth } from './auth'

// Load .env from the server directory
config()

const app = express()
const port = Number(process.env.PORT ?? 3000)

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
)

app.all('/api/auth/*', toNodeHandler(auth))

app.use(express.json())

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Only start the server if not being imported for config
if (process.env.SKIP_SERVER !== 'true') {
  app.listen(port, () => {
    console.log(`Better Auth server listening on http://localhost:${port}`)
  })
}
