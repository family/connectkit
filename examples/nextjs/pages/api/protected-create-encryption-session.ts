import Openfort from '@openfort/openfort-node';
import type { NextApiRequest, NextApiResponse } from 'next';

// this is a simple example of how to use the Openfort SDK to create a recovery session

const openfort = (() => {
  if (!process.env.NEXTAUTH_OPENFORT_SECRET_KEY) {
    throw new Error("Openfort secret key is not set");
  }

  return new Openfort(process.env.NEXTAUTH_OPENFORT_SECRET_KEY);
})();


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    const session = await openfort.registerRecoverySession(process.env.NEXT_PUBLIC_SHIELD_API_KEY!, process.env.NEXTAUTH_SHIELD_SECRET_KEY!, process.env.NEXTAUTH_SHIELD_ENCRYPTION_SHARE!)
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
