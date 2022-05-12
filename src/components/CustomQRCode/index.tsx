import React from 'react';
import { CustomQRCodeProps } from './types';
import {
  QRCodeContainer,
  LogoContainer,
  LogoIcon,
  QRPlaceholder,
  QRPlaceholderContent,
  QRCodeSkeleton,
} from './styles';

import { QRCode } from 'react-qrcode-logo';
import Tooltip from './../Tooltip';
import { AnimatePresence, motion } from 'framer-motion';

const CustomQRCode = React.forwardRef(
  (
    { value, image, tooltipMessage }: CustomQRCodeProps,
    ref: React.Ref<HTMLElement>
  ) => {
    return (
      <QRCodeContainer
      /*
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.2 }}
        transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 0.98] }}
        */
      >
        <LogoContainer
          initial={{ opacity: 0.3 }}
          animate={{ opacity: value ? 1 : 0.3 }}
        >
          <LogoIcon>
            {tooltipMessage ? (
              <Tooltip xOffset={128} delay={0.1} message={tooltipMessage}>
                {image}
              </Tooltip>
            ) : (
              image
            )}
          </LogoIcon>
        </LogoContainer>
        <AnimatePresence>
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 5,
              background: 'white',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: value ? 1 : 0 }}
          >
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
          </motion.div>
          <QRPlaceholder>
            <QRPlaceholderContent>
              <QRCodeSkeleton style={{ top: 0, right: 0 }} />
              <QRCodeSkeleton style={{ top: 0, left: 0 }} />
              <QRCodeSkeleton style={{ bottom: 0, left: 0 }} />
            </QRPlaceholderContent>
          </QRPlaceholder>
        </AnimatePresence>
      </QRCodeContainer>
    );
  }
);
CustomQRCode.displayName = 'CustomQRCode';

export default CustomQRCode;
