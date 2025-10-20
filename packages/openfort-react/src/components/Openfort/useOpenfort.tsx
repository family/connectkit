import React from 'react'
import { Openfortcontext } from './context'

export const useOpenfort = () => {
  const context = React.useContext(Openfortcontext)
  if (!context) throw Error('Openfort Hook must be inside a Provider.')
  return context
}
