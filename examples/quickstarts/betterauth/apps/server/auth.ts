import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';
import { config } from 'dotenv';
import { bearer } from "better-auth/plugins"

config();

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
  trustedOrigins: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:3000'],
  plugins: [
    bearer(),
  ]
});
