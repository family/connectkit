import { createContext } from 'react'

export type CommonEmail = {
  email?: string
  setEmail: (email: string) => void
}

export const CommonEmailContext = createContext<CommonEmail | undefined>(undefined)
