// api/hello.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function fetch(req: VercelRequest, res: VercelResponse) {
  // biome-ignore lint: sample
  console.log('Request received:', req.body)
  res.status(200).json({ message: 'Hello from TypeScript API!' })
}
