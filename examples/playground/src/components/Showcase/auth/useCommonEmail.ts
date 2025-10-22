import React from 'react'
import { type CommonEmail, CommonEmailContext } from '@/components/Showcase/auth/CommonEmailContext'

export const useCommonEmail = (): CommonEmail => {
  const context = React.useContext(CommonEmailContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within a ContextProvider')
  }
  return context
}
