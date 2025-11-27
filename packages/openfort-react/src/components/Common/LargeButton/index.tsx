import Button from '../Button'
import { LargeButtonIcon, LargeButtonLabel, LargeButtonStyle } from './styles'

export const LargeButton: React.FC<{
  onClick: () => void
  icon?: React.ReactNode
  children?: React.ReactNode
}> = ({ children, icon, onClick }) => {
  return (
    <LargeButtonStyle>
      <Button onClick={onClick}>
        <LargeButtonLabel>{children}</LargeButtonLabel>
        <LargeButtonIcon>{icon}</LargeButtonIcon>
      </Button>
    </LargeButtonStyle>
  )
}
