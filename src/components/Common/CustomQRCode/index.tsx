import React from 'react';
import { CustomQRCodeProps } from './types';
import {
  QRCodeContainer,
  LogoContainer,
  LogoIcon,
  QRPlaceholder,
  QRCodeContent,
} from './styles';

import Tooltip from '../Tooltip';
import { AnimatePresence, motion } from 'framer-motion';

import { QRCode } from './QRCode';

const CustomQRCode = React.forwardRef(
  (
    {
      value,
      image,
      imageBackground,
      imagePosition = 'center',
      tooltipMessage,
    }: CustomQRCodeProps,
    ref: React.Ref<HTMLElement>
  ) => {
    const Logo = tooltipMessage ? (
      <Tooltip xOffset={142} delay={0.1} message={tooltipMessage}>
        {image}
      </Tooltip>
    ) : (
      image
    );

    return (
      <QRCodeContainer>
        <QRCodeContent>
          <LogoContainer>
            <LogoIcon
              $wcLogo={imagePosition !== 'center'}
              style={{
                background: imagePosition === 'center' && imageBackground,
              }}
            >
              {Logo}
            </LogoIcon>
          </LogoContainer>

          {value ? (
            <AnimatePresence initial={false} exitBeforeEnter>
              <motion.div
                key={value}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, position: 'absolute', inset: [0, 0] }}
                transition={{
                  duration: 0.4,
                }}
              >
                <QRCode
                  uri={value}
                  size={288}
                  ecl="M"
                  clearArea={imagePosition === 'center'}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <QRPlaceholder />
          )}
        </QRCodeContent>
      </QRCodeContainer>
    );
  }
);
CustomQRCode.displayName = 'CustomQRCode';

export default CustomQRCode;
