import { createContext } from 'react'
import { ContextValue } from './CoreOpenfortProvider'

export const Context = createContext<ContextValue | null>(null)
