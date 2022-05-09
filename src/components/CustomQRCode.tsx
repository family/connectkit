import React from 'react';
import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

import { QRCode } from 'react-qrcode-logo';
import Tooltip from './Tooltip';

const QRCodeContainer = styled(motion.div)`
  z-index: 3;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px auto 6px;
  padding: 4px;
  width: 99%; // 100% will cause shifting issues
  height: auto;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 0 0 1px var(--body-divider);
  canvas {
    display: block;
    max-width: 100%;
    width: 100% !important;
    height: auto !important;
  }
`;

const PlaceholderKeyframes = keyframes`
  0%{ background-position: 100% 0; }
  100%{ background-position: -100% 0; }
`;
const QRPlaceholder = styled(motion.div)`
  height: 0;
  padding-bottom: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &:before {
    z-index: 4;
    content: '';
    position: absolute;
    inset: 0;
    transform: scale(1.5) rotate(45deg);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 50%,
      #ffffff,
      rgba(255, 255, 255, 0)
    );
    opacity: 0.75;
    background-size: 200% 100%;
    animation: ${PlaceholderKeyframes} 1000ms linear infinite both;
  }
`;

const QRPlaceholderContent = styled(motion.div)`
  position: absolute;
  inset: 12px;
  background: repeat;
  background-size: 2.4% 2.4%;
  background-image: url("data:image/svg+xml,%3Csvg width='7' height='7' viewBox='0 0 7 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23F5F5F5'/%3E%3C/svg%3E%0A");

  &:before,
  &:after {
    z-index: 1;
    content: '';
    position: absolute;
    inset: 30.5%;
    background: #fff;
  }
  &:after {
    z-index: 3;
    opacity: 0.8;
  }
`;
const QRCodeSkeleton = styled(motion.div)`
  position: absolute;
  background: #f5f5f5;
  border-radius: 9px;
  width: 13.5%;
  height: 13.5%;
  box-shadow: 0 0 0 3px white;
  &:before {
    content: '';
    position: absolute;
    inset: 8px;
    border-radius: 3px;
    background: inherit;
    box-shadow: 0 0 0 3px #fff;
  }
`;

const LogoContainer = styled(motion.div)`
  z-index: 5;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LogoIcon = styled(motion.div)`
  position: relative;
  width: 25.7%;
  height: 25.7%;
  border-radius: 17px;
  overflow: hidden;
  &:before {
    pointer-events: none;
    z-index: 2;
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.02);
  }
  svg {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    transform: scale(1.02); // fixes 1px gap in Safari
  }
`;

type CustomQRCodeProps = {
  value: string | null;
  image?: React.ReactNode;
  tooltipMessage?: React.ReactNode | string;
};
const CustomQRCode = React.forwardRef(
  (
    { value, image, tooltipMessage }: CustomQRCodeProps,
    ref: React.Ref<HTMLElement>
  ) => {
    return (
      <QRCodeContainer>
        <LogoContainer>
          <LogoIcon
            //layoutId="connectorLogo"
            transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 0.98] }}
          >
            {tooltipMessage ? (
              <Tooltip xOffset={128} delay={0.1} message={tooltipMessage}>
                {image}
              </Tooltip>
            ) : (
              image
            )}
          </LogoIcon>
        </LogoContainer>
        {value && (
          <QRCode
            bgColor="transparent"
            logoImage={image ? btoa(image.toString()) : undefined}
            removeQrCodeBehindLogo={true}
            value={value}
            size={288}
            qrStyle="dots"
            eyeRadius={12}
            ecLevel="M"
            logoWidth={76}
            logoHeight={76}
          />
        )}
        {!value && (
          <QRPlaceholder>
            <QRPlaceholderContent>
              <QRCodeSkeleton style={{ top: 0, right: 0 }} />
              <QRCodeSkeleton style={{ top: 0, left: 0 }} />
              <QRCodeSkeleton style={{ bottom: 0, left: 0 }} />
            </QRPlaceholderContent>
          </QRPlaceholder>
        )}
      </QRCodeContainer>
    );
  }
);
CustomQRCode.displayName = 'CustomQRCode';

export default CustomQRCode;
