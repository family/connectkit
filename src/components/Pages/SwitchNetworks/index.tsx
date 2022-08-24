import React from 'react';
import { useContext } from '../../ConnectKit';
import localizations from '../../../constants/localizations';

import {
  PageContent,
  ModalContent,
  ModalHeading,
  ModalHeadingBlock,
} from '../../Common/Modal/styles';
import ChainSelectList from '../../Common/ChainSelectList';

const SwitchNetworks: React.FC = () => {
  const context = useContext();
  const copy = localizations[context.lang].switchNetworkScreen;

  return (
    <PageContent>
      {/* <ModalHeading>{copy.heading}</ModalHeading> */}
      <ModalHeadingBlock />
      <ModalContent>
        <ChainSelectList />
      </ModalContent>
    </PageContent>
  );
};

export default SwitchNetworks;
