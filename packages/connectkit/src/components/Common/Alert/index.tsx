import { AlertProps } from './types';
import { AlertContainer, IconContainer } from './styles';

const Alert = ({ children, error, icon }: AlertProps) => {
  return (
    <AlertContainer $error={error}>
      {icon && <IconContainer>{icon}</IconContainer>}
      <div>{children}</div>
    </AlertContainer>
  );
};
Alert.displayName = 'Alert';

export default Alert;
