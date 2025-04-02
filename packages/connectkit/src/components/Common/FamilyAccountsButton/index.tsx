import {
  ButtonContainer,
  InnerContainer,
  IconContainer,
  ButtonContainerInner,
} from './styles';
import FitText from '../FitText';
import { FamilyAccount } from '../../../assets/logos';
import useLocales from '../../../hooks/useLocales';

export const FamilyAccountsButton = ({ onClick }: { onClick: () => void }) => {
  const locales = useLocales();
  return (
    <ButtonContainer onClick={onClick}>
      <ButtonContainerInner>
        <IconContainer>
          <FamilyAccount />
        </IconContainer>
        <InnerContainer>
          <FitText>{locales.continueWithFamily}</FitText>
        </InnerContainer>
      </ButtonContainerInner>
    </ButtonContainer>
  );
};
