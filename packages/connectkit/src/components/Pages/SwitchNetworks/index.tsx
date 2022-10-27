import React from 'react';

import {
  PageContent,
  ModalContent,
  ModalBody,
} from '../../Common/Modal/styles';
import ChainSelectList from '../../Common/ChainSelectList';
import { useConnect, useDisconnect, useNetwork } from 'wagmi';
import localizations, { localize } from '../../../constants/localizations';
import { useContext } from '../../ConnectKit';
import Button from '../../Common/Button';
import { DisconnectIcon } from '../../../assets/icons';

const SwitchNetworks: React.FC = () => {
  const context = useContext();

  const { reset } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const warnings = localizations[context.lang].warnings;

  const onDisconnect = () => {
    disconnect();
    reset();
  };

  return (
    <PageContent style={{ width: 278 }}>
      <ModalContent style={{ padding: 0, marginTop: -10 }}>
        {chain?.unsupported && (
          <ModalBody>
            {localize(warnings.chainUnsupported)}
            <br />
            {localize(warnings.chainUnsupportedResolve)}
          </ModalBody>
        )}

        <div style={{ padding: '6px 8px', marginBottom: -8 }}>
          <ChainSelectList />
        </div>

        {chain?.unsupported && (
          <Button icon={<DisconnectIcon />} onClick={onDisconnect}>
            Disconnect
          </Button>
        )}
      </ModalContent>
    </PageContent>
  );
};

export default SwitchNetworks;
