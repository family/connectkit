import { createContext } from 'react'
import type { ContextValue } from './CoreOpenfortProvider'

export const Context = createContext<ContextValue | null>(null)
