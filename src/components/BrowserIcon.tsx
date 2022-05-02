import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { detectBrowser } from './../utils';
import browsers from './../assets/browsers';

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

type BrowserIconProps = {
  browser?: string; // empty string will display current browser
};
const BrowserIcon = React.forwardRef(
  ({ browser }: BrowserIconProps, ref: React.Ref<HTMLElement>) => {
    const currentBrowser = browser ?? detectBrowser();

    let icon;
    switch (currentBrowser) {
      case 'chrome':
        icon = browsers.Chrome;
        break;
      case 'firefox':
        icon = browsers.FireFox;
        break;
      case 'edge':
        icon = browsers.Edge;
        break;
      case 'brave':
        //   icon = browsers.Brave;
        break;
    }
    if (!icon) return <></>;
    return <Container>{icon}</Container>;
  }
);
BrowserIcon.displayName = 'BrowserIcon';

export default BrowserIcon;
