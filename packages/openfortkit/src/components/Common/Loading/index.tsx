import { css, keyframes } from "styled-components";
import styled from "../../../styles/styled";
import { useEffect } from "react";
import { useFortKit } from "../../FortKit";
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

const dist = 2;
const outlineKeyframes = keyframes`
  0%{ opacity:1; }
  100%{ opacity:0; }
`;
const ConnectingAnimation = styled(motion.div) <{
  $shake: boolean;
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
  ${(props) => props.$shake &&
    css`
    &:before {
      animation: ${outlineKeyframes} 220ms ease-out 500ms both;
    }
  `}
`;

const Loader = ({ reason, isLoading = true, icon }: { reason: string, isLoading?: boolean, icon?: React.ReactNode }) => {

  const { triggerResize } = useFortKit();

  useEffect(() => {
    return () => triggerResize();
  }, []);

  return (
    <>
      <ConnectingContainer>
        <ConnectingAnimation
          $shake={!isLoading}
        >
          <SquircleSpinner
            logo={
              <div
                style={{
                  transform: 'scale(0.75)',
                  position: 'relative',
                  width: '100%',
                }}
              >
                {icon || <Logos.Openfort />}
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
