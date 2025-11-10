import OpenfortSDK from '@openfort/openfort-node';
import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import { config } from 'dotenv';
import express, { type Request, type Response } from 'express';
import { auth } from './auth';

// Load .env from the server directory
config();

const app = express();
const port = Number(process.env.PORT ?? 3000);

const openfortSecretKey = process.env.OPENFORT_SECRET_KEY;
if (!openfortSecretKey) {
  throw new Error('Openfort secret key is not set');
}

// Handle both ESM and CommonJS module formats
const Openfort =
  (OpenfortSDK as unknown as { default?: typeof OpenfortSDK }).default || OpenfortSDK;
const openfort = new Openfort(openfortSecretKey);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());

async function createEncryptionSession(_req: Request, res: Response) {
  try {
    const shieldApiKey = process.env.SHIELD_API_KEY;
    const shieldSecretKey = process.env.SHIELD_SECRET_KEY;
    const shieldEncryptionShare = process.env.SHIELD_ENCRYPTION_SHARE;

    if (!shieldApiKey || !shieldSecretKey || !shieldEncryptionShare) {
      return res.status(500).send({
        error: 'Shield configuration is missing',
      });
    }

    const session = await openfort.registerRecoverySession(
      shieldApiKey,
      shieldSecretKey,
      shieldEncryptionShare
    );

    return res.status(200).send({
      session: session,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      error: 'Internal server error',
    });
  }
}

app.post('/api/protected-create-encryption-session', createEncryptionSession);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Only start the server if not being imported for config
if (process.env.SKIP_SERVER !== 'true') {
  app.listen(port, () => {
    console.log(`Better Auth server listening on http://localhost:${port}`);
  });
}
