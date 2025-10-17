import { AlertContainer, IconContainer } from './styles'
import type { AlertProps } from './types'

const Alert = ({ children, error, icon }: AlertProps) => {
  return (
    <AlertContainer $error={error}>
      {icon && <IconContainer>{icon}</IconContainer>}
      <div>{children}</div>
    </AlertContainer>
  )
}
Alert.displayName = 'Alert'

export default Alert
