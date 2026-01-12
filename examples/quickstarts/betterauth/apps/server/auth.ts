import { encryptionSession, openfort } from '@openfort/better-auth'
import { betterAuth } from 'better-auth'
import { bearer } from 'better-auth/plugins'
import Database from 'better-sqlite3'
import { config } from 'dotenv'
import { openfortSDK } from './openfort'

config()

export const auth = betterAuth({
  database: new Database('./auth.db'),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  logger: {
    level: 'debug',
    log: console.log,
  },
  trustedOrigins: process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000'],
  plugins: [
    bearer(),
    openfort({
      client: openfortSDK,
      use: [
        encryptionSession({
          config: {
            apiKey: process.env.SHIELD_API_KEY as string,
            secretKey: process.env.SHIELD_SECRET_KEY as string,
            encryptionPart: process.env.SHIELD_ENCRYPTION_SHARE as string,
          },
        }),
      ],
    }),
  ],
})
