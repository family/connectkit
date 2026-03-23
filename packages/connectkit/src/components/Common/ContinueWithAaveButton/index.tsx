import {
  ButtonContainer,
  InnerContainer,
  IconContainer,
  ButtonContainerInner,
} from './styles';
import FitText from '../FitText';
import useLocales from '../../../hooks/useLocales';

const Logo = () => (
  <svg
    width="27"
    height="15"
    viewBox="0 0 27 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.85405 13.9979C11.3617 13.9979 12.5838 12.7757 12.5838 11.2681C12.5838 9.76047 11.3617 8.5383 9.85405 8.5383C8.34643 8.5383 7.12427 9.76047 7.12427 11.2681C7.12427 12.7757 8.34643 13.9979 9.85405 13.9979Z"
      fill="currentColor"
    />
    <path
      d="M16.8534 13.9979C18.3611 13.9979 19.5832 12.7757 19.5832 11.2681C19.5832 9.76047 18.3611 8.5383 16.8534 8.5383C15.3458 8.5383 14.1237 9.76047 14.1237 11.2681C14.1237 12.7757 15.3458 13.9979 16.8534 13.9979Z"
      fill="currentColor"
    />
    <path
      d="M13.4193 0C6.00734 0 -0.00193968 6.12375 4.69662e-07 13.6754H3.42824C3.42824 8.01604 7.866 3.42759 13.4193 3.42759C18.9727 3.42759 23.4104 8.01604 23.4104 13.6754H26.8387C26.84 6.12375 20.8307 0 13.4193 0Z"
      fill="currentColor"
    />
  </svg>
);

export const ContinueWithAaveButton = ({
  onClick,
}: {
  onClick: () => void;
}) => {
  const locales = useLocales();
  return (
    <ButtonContainer onClick={onClick}>
      <ButtonContainerInner>
        <IconContainer>
          <Logo />
        </IconContainer>
        <InnerContainer>
          <FitText>{locales.continueWithAave}</FitText>
        </InnerContainer>
      </ButtonContainerInner>
    </ButtonContainer>
  );
};
