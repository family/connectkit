import Openfort from '@openfort/openfort-node'

if (!process.env.OPENFORT_SECRET_KEY) {
  throw new Error('OPENFORT_SECRET_KEY is not set')
}

export const openfortSDK = new Openfort(process.env.OPENFORT_SECRET_KEY)
