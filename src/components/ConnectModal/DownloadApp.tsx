import React, { useState } from 'react';
import { useContext } from '../FamilyKit';
import localizations, { localize } from '../../constants/localizations';
import supportedConnectors from '../../constants/supportedConnectors';

import { ModalBody, ModalContent, ModalHeading } from '../Modal/styles';
import { OrDivider } from '../Modal';

import CustomQRCode from '../CustomQRCode';
import Button from '../Button';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;

const ExternalLinkIcon = ({ ...props }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4C2.89543 4 2 4.89543 2 6V12C2 13.1046 2.89543 14 4 14H10C11.1046 14 12 13.1046 12 12V9.66667C12 9.11438 12.4477 8.66667 13 8.66667C13.5523 8.66667 14 9.11438 14 9.66667V12C14 14.2091 12.2091 16 10 16H4C1.79086 16 0 14.2091 0 12V6C0 3.79086 1.79086 2 4 2H6.33333C6.88562 2 7.33333 2.44772 7.33333 3C7.33333 3.55228 6.88562 4 6.33333 4H4Z"
      fill="currentColor"
      fillOpacity={0.3}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.5 1C9.5 0.447715 9.94772 0 10.5 0H15C15.5523 0 16 0.447715 16 1V5.5C16 6.05228 15.5523 6.5 15 6.5C14.4477 6.5 14 6.05228 14 5.5V3.41421L8.70711 8.70711C8.31658 9.09763 7.68342 9.09763 7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289L12.5858 2H10.5C9.94772 2 9.5 1.55228 9.5 1Z"
      fill="currentColor"
      fillOpacity={0.3}
    />
  </svg>
);

const DownloadApp: React.FC<{
  connectorId: string;
}> = ({ connectorId }) => {
  const context = useContext();
  const copy = localizations[context.lang].downloadAppScreen;

  const [id, setId] = useState(connectorId);
  const connector = supportedConnectors.filter((c) => c.id === id)[0];

  const localizeText = (text: string) => {
    return localize(text, {
      CONNECTORNAME: connector.name,
    });
  };
  if (!connector) return <>Connector not found</>;

  const hasApps =
    connector.appUrls && Object.keys(connector.appUrls).length !== 0;

  if (!hasApps) return <>No apps to download</>;
  return (
    <Container>
      <ModalHeading>{localizeText(copy.heading)}</ModalHeading>
      <ModalContent style={{ paddingBottom: 4, gap: 14 }}>
        <CustomQRCode value={'TODO: Download API'} image={connector.logo} />
        <ModalBody>{localizeText(copy.p)}</ModalBody>
        {connector.defaultConnect && <OrDivider />}
      </ModalContent>

      {connector.defaultConnect && ( // Open the default connector modal
        <Button
          icon={
            <ExternalLinkIcon
              style={{
                left: 3,
                top: 0,
              }}
            />
          }
        >
          Open Default Modal
        </Button>
      )}
    </Container>
  );
};

export default DownloadApp;
