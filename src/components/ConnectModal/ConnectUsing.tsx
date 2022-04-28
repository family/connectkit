import React, { useEffect, useState } from 'react';

import styled, { css, keyframes } from 'styled-components';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { ModalHeading } from '../Modal/styles';
import Logos from '../../assets/logos';
import Button from '../Button';
import { useContext } from '../FamilyKit';

const ButtonAnchor = styled(motion.a)`
  appearance: none;
  cursor: pointer;
  user-select: none;
  min-width: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  height: 48px;
  margin: 24px 0 0;
  padding: 0 32px;
  text-decoration: none;
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
  color: var(--body-color);
  background: var(--body-background-secondary);
  white-space: nowrap;
  will-change: transform;
  transition: transform 100ms ease;

  &:hover {
    transform: scale(1.01);
  }
  &:active {
    transform: scale(0.99);
  }
`;

const contentVariants: Variants = {
  hidden: {
    position: 'absolute',
    opacity: 0,
    scale: 0.95,
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.3,
    },
  },
  visible: {
    position: 'relative',
    opacity: 1,
    scale: 1,
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.4,
      delay: 0.05,
    },
  },
};

const dist = 2;
const shakeKeyframes = keyframes`
  0%{ transform:none; }
  25%{ transform:translateX(${dist}px); }
  50%{ transform:translateX(-${dist}px); }
  75%{ transform:translateX(${dist}px); }
  100%{ transform:none; }
`;
const outlineKeyframes = keyframes`
  0%{ opacity:1; }
  100%{ opacity:0; }
`;
const Container = styled(motion.div)`
  min-width: 100%;
  width: 310px;
`;
const ConnectingContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px auto 16px;
  height: 120px;
`;
const ConnectingAnimation = styled(motion.div)<{ status?: string }>`
  position: relative;
  --spinner-error-opacity: 0;
  &:before {
    content: '';
    position: absolute;
    inset: 1px;
    opacity: 0;
    background: var(--body-color-danger);
  }
  ${(props) =>
    props.status === 'failed' &&
    css`
      animation: ${shakeKeyframes} 220ms ease-out both;
      &:before {
        animation: ${outlineKeyframes} 220ms ease-out 750ms both;
      }
    `}
`;

const LogoContainer = styled(motion.div)`
  position: relative;
  overflow: hidden;
  //background: var(--body-background-secondary);
  svg {
    z-index: 3;
    position: relative;
    display: block;
  }
`;
const Spinner = styled(motion.div)`
  pointer-events: none;
  user-select: none;
  z-index: 1;
  position: absolute;
  inset: -25%;
  //animation: rotateGradient 600ms ease-out; // extra spin on init
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: conic-gradient(
      from -90deg,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      var(--family-brand)
    );
    animation: rotateGradient 1200ms linear infinite;
  }
  @keyframes rotateGradient {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const SpinnerCap = styled(motion.div)`
  z-index: 5;
  position: absolute;
  top: 50%;
  left: 1px;
  right: 50%;
  height: 3px;
  transform-origin: 100% 50%;
  animation: rotateGradient 1200ms linear infinite,
    rotateCap 1200ms ease-in-out infinite;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 3px;
    background: var(--family-brand);
    border-radius: 3px;
  }
  @keyframes rotateCap {
    0%,
    25%,
    50%,
    75%,
    100% {
      left: 0%;
    }
    12.5%,
    37.5%,
    62.5%,
    87.5% {
      left: -7.5%;
    }
  }
`;
const Logo = styled(motion.div)`
  z-index: 2;
  position: absolute;
  overflow: hidden;
  inset: 6px;
  border-radius: 16px;
  background: var(--body-background-secondary);
  svg,
  img {
    pointer-events: none;
    display: block;
    width: 100%;
    height: 100%;
  }
`;
const ContentContainer = styled(motion.div)`
  position: relative;
  padding: 0;
`;
const Content = styled(motion.div)`
  left: 0;
  right: 0;
`;
const Heading = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 16px 6px;
  text-align: center;
  font-size: 19px;
  font-weight: 600;
  line-height: 24px;
  color: var(--body-color);
`;
const Body = styled(motion.div)`
  padding: 0 16px 16px;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  color: var(--body-color-muted);
`;

const RetryButton = styled(motion.button)`
  z-index: 4;
  appearance: none;
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  cursor: pointer;

  background: var(--body-background-secondary);
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);

  &:hover {
    --background: var(--body-background-secondary-hover);
  }
`;

const AlertIcon = ({ ...props }) => {
  return (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" {...props}>
      <path
        d="M2.20779 17H15.7922C17.1342 17 18 15.9796 18 14.7286C18 14.356 17.9134 13.9744 17.7143 13.6195L10.9091 1.14457C10.4935 0.381524 9.74892 0 9.00433 0C8.25974 0 7.49784 0.381524 7.09091 1.14457L0.294372 13.6284C0.0952381 13.9744 0 14.356 0 14.7286C0 15.9796 0.865801 17 2.20779 17ZM9.00433 10.8601C8.49351 10.8601 8.20779 10.5673 8.19048 10.035L8.06061 5.96242C8.04329 5.42119 8.4329 5.03079 8.99567 5.03079C9.54978 5.03079 9.95671 5.43006 9.93939 5.97129L9.80952 10.0261C9.78355 10.5673 9.49784 10.8601 9.00433 10.8601ZM9.00433 14.1874C8.42424 14.1874 7.94805 13.7704 7.94805 13.1759C7.94805 12.5814 8.42424 12.1644 9.00433 12.1644C9.58442 12.1644 10.0606 12.5725 10.0606 13.1759C10.0606 13.7792 9.57576 14.1874 9.00433 14.1874Z"
        fill="var(--body-color-danger)"
      />
    </svg>
  );
};

const RetryIcon = ({ ...props }) => {
  return (
    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" {...props}>
      <path
        d="M17.5001 2.79858V7.59948H12.6992"
        stroke="var(--body-color)"
        strokeWidth="2.11239"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.4998 7.59949L13.7951 4.11084C12.6913 3.00643 11.2586 2.29065 9.71267 2.07138C8.16676 1.8521 6.59146 2.14121 5.22415 2.89513C3.85685 3.64905 2.77161 4.82693 2.13199 6.25129C1.49236 7.67565 1.33299 9.26931 1.6779 10.7921C2.02281 12.3149 2.85331 13.6844 4.04426 14.6941C5.2352 15.7039 6.72205 16.2992 8.28077 16.3904C9.83949 16.4816 11.3856 16.0637 12.6862 15.1997C13.1632 14.8828 13.5977 14.5122 13.9823 14.0973"
        stroke="url(#paint0_angular_927_1455)"
        strokeWidth="2.11239"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <radialGradient
          id="paint0_angular_927_1455"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(9.49988 9.20134) rotate(-15.385) scale(8.29746 7.38439)"
        >
          <stop offset="0.0426795" stopColor="var(--body-color-muted)" />
          <stop offset="0.159005" stopColor="var(--body-color-muted)" />
          <stop offset="1" stopColor="var(--body-color)" />
        </radialGradient>
      </defs>
    </svg>
  );
};

const ConnectUsing: React.FC<{ wallet?: any }> = ({ wallet }) => {
  const context = useContext();
  const states = {
    CONNECTING: 'connecting',
    FAILED: 'failed',
    UNAVAILABLE: 'unavailable',
  };
  const [status, setStatus] = useState(
    window.ethereum ? states.CONNECTING : states.UNAVAILABLE
  );

  let timeout: any;

  useEffect(() => {
    if (status === states.CONNECTING) {
      console.log('TODO: Call MetaMask extension here');
      clearTimeout(timeout);
      timeout = setTimeout(
        () => setStatus(states.FAILED),
        1000 + Math.random() * 2000
      );
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [status]);

  return (
    <Container>
      <ModalHeading>{wallet.name}</ModalHeading>
      <ConnectingContainer>
        <ConnectingAnimation status={status}>
          <AnimatePresence>
            {status === states.FAILED && (
              <RetryButton
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                onClick={() => setStatus(states.CONNECTING)}
              >
                <RetryIcon />
              </RetryButton>
            )}
          </AnimatePresence>
          <LogoContainer>
            <Logo>{wallet.logo}</Logo>
            {status === states.CONNECTING && (
              <Spinner initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            )}
            <svg width="102" height="102" viewBox="0 0 102 102" fill="none">
              <rect
                x="7.57895"
                y="7.57895"
                width="86.8421"
                height="86.8421"
                rx="19.2211"
                stroke="black"
                strokeOpacity="0.02"
                strokeWidth="1.15789"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 0H102V102H0V0ZM7 38.284C7 27.5684 7 22.2106 9.01905 18.0892C10.9522 14.1431 14.1431 10.9522 18.0892 9.01905C22.2106 7 27.5684 7 38.284 7H63.716C74.4316 7 79.7894 7 83.9108 9.01905C87.8569 10.9522 91.0478 14.1431 92.9809 18.0892C95 22.2106 95 27.5684 95 38.284V63.716C95 74.4316 95 79.7894 92.9809 83.9108C91.0478 87.8569 87.8569 91.0478 83.9108 92.9809C79.7894 95 74.4316 95 63.716 95H38.284C27.5684 95 22.2106 95 18.0892 92.9809C14.1431 91.0478 10.9522 87.8569 9.01905 83.9108C7 79.7894 7 74.4316 7 63.716V38.284ZM41.5 0.5H41.4325C34.7246 0.499996 29.6023 0.499994 25.5104 0.823325C21.388 1.14906 18.1839 1.80986 15.3416 3.20227C10.0602 5.78959 5.78959 10.0602 3.20227 15.3416C1.80986 18.1839 1.14906 21.388 0.823325 25.5104C0.499994 29.6023 0.499996 34.7246 0.5 41.4325V41.5V55.5938C0.5 55.6808 0.507407 55.766 0.521624 55.849C0.507407 55.9319 0.5 56.0172 0.5 56.1042V60.5V60.5675C0.499996 67.2754 0.499994 72.3977 0.823325 76.4896C1.14906 80.612 1.80986 83.8161 3.20227 86.6584C5.78959 91.9398 10.0602 96.2104 15.3416 98.7977C18.1839 100.19 21.388 100.851 25.5104 101.177C29.6022 101.5 34.7244 101.5 41.432 101.5H41.4324H41.5H43.4227H60.5H60.5675H60.568C67.2756 101.5 72.3977 101.5 76.4896 101.177C80.612 100.851 83.8161 100.19 86.6584 98.7977C91.9398 96.2104 96.2104 91.9398 98.7977 86.6584C100.19 83.8161 100.851 80.612 101.177 76.4896C101.5 72.3978 101.5 67.2756 101.5 60.568V60.5676V60.5V41.5V41.4324V41.432C101.5 34.7244 101.5 29.6022 101.177 25.5104C100.851 21.388 100.19 18.1839 98.7977 15.3416C96.2104 10.0602 91.9398 5.78959 86.6584 3.20227C83.8161 1.80986 80.612 1.14906 76.4896 0.823325C72.3977 0.499994 67.2754 0.499996 60.5675 0.5H60.5H41.5ZM3.5 56.1042C3.5 56.0172 3.49259 55.9319 3.47838 55.849C3.49259 55.766 3.5 55.6808 3.5 55.5938V41.5C3.5 34.7112 3.50109 29.7068 3.814 25.7467C4.1256 21.8032 4.73946 19.0229 5.89635 16.6614C8.19077 11.9779 11.9779 8.19077 16.6614 5.89635C19.0229 4.73946 21.8032 4.1256 25.7467 3.814C29.7068 3.50109 34.7112 3.5 41.5 3.5H60.5C67.2888 3.5 72.2932 3.50109 76.2533 3.814C80.1968 4.1256 82.977 4.73946 85.3386 5.89635C90.022 8.19077 93.8092 11.9779 96.1036 16.6614C97.2605 19.0229 97.8744 21.8032 98.186 25.7467C98.4989 29.7068 98.5 34.7112 98.5 41.5V60.5C98.5 67.2888 98.4989 72.2932 98.186 76.2533C97.8744 80.1968 97.2605 82.9771 96.1036 85.3386C93.8092 90.022 90.022 93.8092 85.3386 96.1036C82.977 97.2605 80.1968 97.8744 76.2533 98.186C72.2932 98.4989 67.2888 98.5 60.5 98.5H43.4227H41.5C34.7112 98.5 29.7068 98.4989 25.7467 98.186C21.8032 97.8744 19.0229 97.2605 16.6614 96.1036C11.9779 93.8092 8.19077 90.022 5.89635 85.3386C4.73946 82.9771 4.1256 80.1968 3.814 76.2533C3.50109 72.2932 3.5 67.2888 3.5 60.5V56.1042Z"
                fill="var(--body-background)"
              />
            </svg>
          </LogoContainer>
        </ConnectingAnimation>
      </ConnectingContainer>

      <ContentContainer>
        <AnimatePresence initial={false}>
          {status === states.FAILED && (
            <Content
              key={states.FAILED}
              initial={'hidden'}
              animate={'visible'}
              exit={'hidden'}
              variants={contentVariants}
            >
              <Heading style={{ color: 'var(--body-color-danger)' }}>
                <AlertIcon />
                Connection Failed
              </Heading>
              <Body>
                Open the {wallet.name} browser extension to connect your wallet.
              </Body>
              <Button onClick={() => setStatus(states.CONNECTING)}>
                Try Again
              </Button>
            </Content>
          )}
          {status === states.CONNECTING && (
            <Content
              key={states.CONNECTING}
              initial={'hidden'}
              animate={'visible'}
              exit={'hidden'}
              variants={contentVariants}
            >
              <Heading>Requesting Connection</Heading>
              <Body>
                Open the {wallet.name} browser extension to connect your wallet.
              </Body>
            </Content>
          )}
          {status === states.UNAVAILABLE && (
            <Content
              key={states.UNAVAILABLE}
              initial={'hidden'}
              animate={'visible'}
              exit={'hidden'}
              variants={contentVariants}
            >
              <Heading>Install {wallet.name}</Heading>
              <Body>
                To connect your {wallet.name} wallet, install the browser
                extension
              </Body>
              <ButtonAnchor
                href={wallet.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Install the Extension
              </ButtonAnchor>
            </Content>
          )}
        </AnimatePresence>
      </ContentContainer>
    </Container>
  );
};

export default ConnectUsing;
