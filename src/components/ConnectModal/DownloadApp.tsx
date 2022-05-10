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
import { ExternalLinkIcon } from '../../assets/icons';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;

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
        <Button icon={<ExternalLinkIcon />}>Open Default Modal</Button>
      )}
    </Container>
  );
};

export default DownloadApp;
