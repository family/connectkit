import { useEffect } from 'react'
import { useSignOut } from '../../hooks/openfort/auth/useSignOut'
import { logger } from '../../utils/logger'
import type { SetRouteOptions } from '../Openfort/types'
import { useOpenfort } from '../Openfort/useOpenfort'
import { PageContentStyle } from './styles'

export type SetOnBackFunction = (() => void) | null | 'inherit' | 'back' | SetRouteOptions

type PageContentProps = {
  children?: React.ReactNode
  width?: number | string
  onBack?: SetOnBackFunction
  logoutOnBack?: boolean
}

export const PageContent = ({ children, width, onBack = 'back', logoutOnBack }: PageContentProps) => {
  const { setOnBack: sob, setRoute, setPreviousRoute, setRouteHistory } = useOpenfort()
  const { signOut } = useSignOut()

  const setOnBack: React.Dispatch<React.SetStateAction<(() => void) | null>> = (...props) => {
    logger.log('Setting on back:', ...props)
    sob(...props)
  }

  useEffect(() => {
    if (typeof onBack === 'string' || (onBack instanceof Object && typeof onBack !== 'function')) {
      switch (onBack) {
        case 'back':
          setOnBack(() => () => setPreviousRoute())
          break
        case 'inherit':
          break
        default:
          setOnBack(() => () => {
            if (logoutOnBack) signOut()
            setRoute(onBack)
          })
      }
    } else if (onBack) {
      if (logoutOnBack) {
        setOnBack(() => () => {
          signOut()
          onBack()
        })
      } else {
        setOnBack(() => onBack)
      }
    } else if (onBack === null) {
      setOnBack(null)
      // If null then clear history
      setRouteHistory((h) => {
        if (h.length > 0) {
          return [h[h.length - 1]]
        }
        return h
      })
    } else setOnBack(null)
    // else setOnBack(() => () => alert('REMOVE DEBUG ON BACK STRING!'))
  }, [onBack, logoutOnBack])

  return <PageContentStyle style={{ width }}>{children}</PageContentStyle>
}
