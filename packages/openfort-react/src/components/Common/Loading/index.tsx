import { css, keyframes } from "styled-components";
import styled from "../../../styles/styled";
import { useEffect } from "react";
import { useOpenfort } from '../../Openfort/useOpenfort';
import { motion } from "framer-motion";
import SquircleSpinner from "../SquircleSpinner";
import Logos from "../../../assets/logos";
import { ModalBody, ModalH1 } from "../Modal/styles";
import { TickIcon } from "../../../assets/icons";

const TextWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  padding: 0 8px 32px;
`;

const ConnectingContainer = styled(motion.div)`
display: flex;
align-items: center;
justify-content: center;
margin: 10px auto 16px;
height: 120px;
`;

const ConnectingAnimation = styled(motion.div) <{
  $success: boolean;
}>`
  user-select: none;
  position: relative;
  --spinner-error-opacity: 0;
  &:before {
    content: '';
    position: absolute;
    inset: 1px;
    opacity: 0;
    background: var(--ck-body-color-valid);
  }
  ${(props) => props.$success &&
    css`
    &:before {
      opacity: 1;
    }
  `}
`;

const Loader = ({ reason, isLoading = true, icon }: { reason: string, isLoading?: boolean, icon?: React.ReactNode }) => {

  const { uiConfig: options } = useOpenfort();
  const { triggerResize } = useOpenfort();

  useEffect(() => {
    return () => triggerResize();
  }, []);

  const renderLogo = () => {
    if (icon) {
      return icon;
    }
    if (options?.logo) {
      if (typeof options.logo === 'string') {
        return <img src={options.logo} alt="Logo" style={{ width: '100%' }} />;
      }
      return options.logo;
    }
    return <Logos.Openfort />;
  }

  return (
    <>
      <ConnectingContainer>
        <ConnectingAnimation
          $success={!isLoading}
        >
          <SquircleSpinner
            logo={
              <div
                style={{
                  padding: '12px',
                  position: 'relative',
                  width: '100%',
                }}
              >
                {renderLogo()}
              </div>
            }
            connecting={isLoading}
          />
        </ConnectingAnimation>
      </ConnectingContainer>
      <TextWrapper>
        {
          isLoading ? (
            <>
              <ModalH1>
                Loading, please wait
              </ModalH1>
              <ModalBody>{reason}</ModalBody>
            </>
          ) : (
            <ModalH1 $valid>
              <TickIcon /> {reason}
            </ModalH1>
          )
        }
      </TextWrapper>
    </>
  );
}

export default Loader;
