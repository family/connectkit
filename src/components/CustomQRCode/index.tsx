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
