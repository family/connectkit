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
    { value, image, tooltipMessage }: CustomQRCodeProps,
    ref: React.Ref<HTMLElement>
  ) => {
    return (
      <QRCodeContainer>
        <QRCodeContent>
          <LogoContainer>
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
          {value ? (
            <AnimatePresence initial={false} exitBeforeEnter>
              <motion.div
                key={value}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, position: 'absolute' }}
                transition={{
                  duration: 0.4,
                }}
              >
                <QRCode
                  uri={value}
                  logoSize={image ? 76 : 0}
                  size={288}
                  ecl="M"
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
