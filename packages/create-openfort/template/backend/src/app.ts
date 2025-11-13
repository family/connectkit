import os from 'node:os';
import Openfort from '@openfort/openfort-node';
import cors from 'cors';
import express, { type Request, type Response } from 'express';

process.loadEnvFile();

// Create an express application
const app = express();
app.use(express.json());

// Custom CORS options
app.use(cors());

// Ensure Openfort is only initialized once
if (!process.env.OPENFORT_SECRET_KEY) {
  throw new Error('Openfort secret key is not set');
}

const openfort = new Openfort(process.env.OPENFORT_SECRET_KEY);

async function createEncryptionSession(req: Request, res: Response) {
  const uaHead = String(req.headers['user-agent']?.split(' ')[0] || 'unknown').replace(/[\[\]]/g, ''); // Remove brackets to prevent log injection
  console.log('[%s] Creating encryption session...', uaHead);

  try {
    const shieldApiKey = process.env.SHIELD_API_KEY;
    const shieldSecretKey = process.env.SHIELD_SECRET_KEY;
    const shieldEncryptionShare = process.env.SHIELD_ENCRYPTION_SHARE;

    if (!shieldApiKey || !shieldSecretKey || !shieldEncryptionShare) {
      throw new Error('Shield environment variables are not set');
    }

    const session = await openfort.registerRecoverySession(
      shieldApiKey,
      shieldSecretKey,
      shieldEncryptionShare,
    );

    res.status(200).send({
      session: session,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      error: 'Internal server error',
    });
  }
}

app.post('/api/protected-create-encryption-session', createEncryptionSession);

// Function to get local IP address
function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    if (interfaces) {
      for (const networkInterface of interfaces) {
        if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
          return networkInterface.address;
        }
      }
    }
  }
  return 'localhost'; // Fallback to localhost if no local IP found
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const localIP = getLocalIP();
  console.log(`Server is running on port ${PORT}`);
  console.log(`  - http://localhost:${PORT}`);
  console.log(`  - http://${localIP}:${PORT}`);
});
