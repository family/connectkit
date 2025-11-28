import Button from '../Button'
import { LargeButtonIcon, LargeButtonLabel, LargeButtonStyle } from './styles'

export const LargeButton: React.FC<{
  onClick: () => void
  icon?: React.ReactNode
  children?: React.ReactNode
  disabled?: boolean
}> = ({ children, icon, onClick, disabled }) => {
  return (
    <LargeButtonStyle>
      <Button onClick={onClick} disabled={disabled}>
        <LargeButtonLabel>{children}</LargeButtonLabel>
        <LargeButtonIcon>{icon}</LargeButtonIcon>
      </Button>
    </LargeButtonStyle>
  )
}
