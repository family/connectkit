import { useEffect } from 'react'
import { useSignOut } from '../../hooks/openfort/auth/useSignOut'
import { ModalHeading } from '../Common/Modal/styles'
import type { SetRouteOptions } from '../Openfort/types'
import { useOpenfort } from '../Openfort/useOpenfort'
import { PageContentStyle } from './styles'

export type SetOnBackFunction = (() => void) | null | 'inherit' | 'back' | SetRouteOptions

type PageContentProps = {
  children?: React.ReactNode
  width?: number | string
  onBack?: SetOnBackFunction
  logoutOnBack?: boolean
  header?: string
}

export const PageContent = ({ children, width, onBack = 'back', logoutOnBack, header }: PageContentProps) => {
  const { setOnBack, setRoute, setPreviousRoute, setRouteHistory } = useOpenfort()
  const { signOut } = useSignOut()

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
  }, [!!onBack, !!logoutOnBack])

  return (
    <PageContentStyle style={{ width }}>
      {header && <ModalHeading>{header}</ModalHeading>}
      {children}
    </PageContentStyle>
  )
}
