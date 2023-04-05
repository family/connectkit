import { InputProps } from './types';
import { InputContainer, InputElement, InputIcon } from './styles';

const Input = ({ icon, ...props }: InputProps) => {
  return (
    <InputContainer>
      {icon && <InputIcon>{icon}</InputIcon>}
      <InputElement {...props} />
    </InputContainer>
  );
};

export default Input;
