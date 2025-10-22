import type React from 'react'
import { type ReactNode, useState } from 'react'
import { CommonEmailContext } from '@/components/Showcase/auth/CommonEmailContext'

interface ConfigurationProviderProps {
  children: ReactNode
}

export const CommonEmailProvider: React.FC<ConfigurationProviderProps> = ({ children }) => {
  const [email, setEmail] = useState<string | undefined>(undefined)

  return (
    <CommonEmailContext.Provider
      value={{
        email,
        setEmail,
      }}
    >
      {children}
    </CommonEmailContext.Provider>
  )
}
