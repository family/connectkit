import { motion } from "framer-motion";
import { OpenfortIcon } from "../../../assets/icons";
import styled from "../../../styles/styled";
import defaultTheme from "../../../constants/defaultTheme";
import { useFortKit } from "../../FortKit";

const PoweredByFooter = ({ showDisclaimer }: { showDisclaimer?: boolean }) => {
  const { options } = useFortKit();

  return (
    <Container>
      <TextButton
        onClick={() => {
          window.open(
            "https://www.openfort.xyz/",
            "_blank",
          );
        }}
      >
        <IconContainer>
          <OpenfortIcon />
        </IconContainer>
        <span>
          Powered by Openfort
        </span>
      </TextButton>
      {showDisclaimer && (
        <Disclaimer>
          {options?.disclaimer ? (
            <>
              {options.disclaimer}
            </>
          ) : (
            <div>
              By logging in, you agree to our <a
                href={options?.termsOfServiceUrl ?? "https://www.openfort.xyz/terms"}
                target="_blank"
                rel="noopener noreferrer"
              >Terms of Service</a> & <a
                href={options?.privacyPolicyUrl ?? "https://www.openfort.xyz/privacy"}
                target="_blank"
                rel="noopener noreferrer"
              >Privacy Policy</a>.
            </div>
          )}
        </Disclaimer>
      )}
    </Container>
  );
};


export const Disclaimer = styled(motion.div)`
  padding: 0px 50px 8px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--ck-body-disclaimer-font-size, 10px);
  font-weight: var(--ck-body-disclaimer-font-weight, 400);
  text-align: center;
  line-height: 1rem;
  color: var(--ck-body-disclaimer-color, var(--ck-body-color-muted, inherit));

  & a {
    color: var(--ck-body-disclaimer-link-color, inherit);
    font-weight: var(--ck-body-disclaimer-font-weight, 400);
    text-decoration: none;
    transition: color 200ms ease;
    &:hover {
      color: var(--ck-body-disclaimer-link-hover-color, inherit);
    }
  }
`;

const IconContainer = styled.div`
  width: 24px;
  height: 24px;
  svg,
  img {
    display: block;
    position: relative;
    pointer-events: none;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  &[data-shape='squircle'] {
    border-radius: 22.5%;
  }
  &[data-shape='circle'] {
    border-radius: 100%;
  }
  &[data-shape='square'] {
    border-radius: 0;
  }
`

const Container = styled(motion.div)`
  text-align: center;
  margin-top: 4px;
  margin-bottom: -16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextButton = styled(motion.button)`
  appearance: none;
  user-select: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 42px;
  padding: 0 16px;
  border-radius: 6px;
  background: none;
  color: var(--ck-body-color-muted);
  text-decoration-color: var(--ck-body-color-muted);
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;

  transition:
    color 200ms ease,
    transform 100ms ease;
  &:hover {
    color: var(--ck-body-color-muted-hover);
    text-decoration-color: var(--ck-body-color-muted-hover);
  }
  &:active {
    transform: scale(0.96);
  }

  span {
    opacity: 1;
    transition: opacity 300ms ease;
  }
`;

export default PoweredByFooter;
