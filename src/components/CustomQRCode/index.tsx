import React from 'react';
import { CustomQRCodeProps } from './types';
import {
  QRCodeContainer,
  LogoContainer,
  LogoIcon,
  QRPlaceholder,
} from './styles';

import Tooltip from './../Tooltip';
import { motion } from 'framer-motion';

import { QRCode } from './QRCode';

const CustomQRCode = React.forwardRef(
  (
    { value, image, tooltipMessage }: CustomQRCodeProps,
    ref: React.Ref<HTMLElement>
  ) => {
    return (
      <QRCodeContainer>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <QRCode uri={value} logoSize={image ? 76 : 0} size={288} ecl="M" />
          </motion.div>
        ) : (
          <QRPlaceholder />
        )}
      </QRCodeContainer>
    );
  }
);
CustomQRCode.displayName = 'CustomQRCode';

export default CustomQRCode;
