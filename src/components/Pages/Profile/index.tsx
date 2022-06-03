import React, { useEffect, useState } from 'react';
import { useContext } from '../../ConnectKit';
import localizations from '../../../constants/localizations';
import { truncateEthAddress } from '../../../utils';

import {
  useConnect,
  useDisconnect,
  useAccount,
  useEnsName,
  useBalance,
  useNetwork,
} from 'wagmi';

import {
  AvatarContainer,
  AvatarInner,
  ChainSelectorContainer,
  BalanceContainer,
  LoadingBalance,
  Balance,
} from './styles';

import {
  PageContent,
  ModalBody,
  ModalContent,
  ModalH1,
  ModalHeading,
} from '../../Common/Modal/styles';
import Button from '../../Common/Button';
import Avatar from '../../Common/Avatar';
import ChainSelector from '../../ConnectModal/ChainSelector';

import { DisconnectIcon } from '../../../assets/icons';
import CopyToClipboard from '../../Common/CopyToClipboard';
import { AnimatePresence } from 'framer-motion';
import Alert from '../../Common/Alert';

const Profile: React.FC = () => {
  const context = useContext();
  const copy = localizations[context.lang].profileScreen;

  const { reset, isConnected } = useConnect();
  const { disconnect } = useDisconnect();

  const [shouldDisconnect, setShouldDisconnect] = useState(false);

  const { data: account } = useAccount();
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: account?.address,
  });
  const { activeChain } = useNetwork();
  const { data: balance } = useBalance({
    addressOrName: account?.address,
    //watch: true,
  });

  useEffect(() => {
    if (!isConnected) context.setOpen(false);
  }, [isConnected]);

  useEffect(() => {
    if (!shouldDisconnect) return;
    // Close before disconnecting to avoid layout shifting while modal is still open
    context.setOpen(false);
    return () => {
      disconnect();
      reset();
    };
  }, [shouldDisconnect, disconnect, reset]);

  if (activeChain?.unsupported) {
    return (
      <PageContent>
        <ModalHeading>Unsupported network</ModalHeading>
        <Alert>
          Your wallet does not support switching networks from this app. Try
          switching networks from within your wallet instead.
        </Alert>
        <Button
          onClick={() => setShouldDisconnect(true)}
          icon={<DisconnectIcon />}
        >
          Disconnect
        </Button>
      </PageContent>
    );
  }
  return (
    <PageContent>
      <ModalHeading>{copy.heading}</ModalHeading>
      <ModalContent style={{ paddingBottom: 22 }}>
        <AvatarContainer>
          <AvatarInner>
            <ChainSelectorContainer>
              <ChainSelector />
            </ChainSelectorContainer>
            <Avatar address={account?.address} />
          </AvatarInner>
        </AvatarContainer>
        <ModalH1>
          <CopyToClipboard string={account?.address}>
            {ensName ?? truncateEthAddress(account?.address)}
          </CopyToClipboard>
        </ModalH1>
        <ModalBody>
          <BalanceContainer>
            <AnimatePresence exitBeforeEnter initial={false}>
              {balance && (
                <Balance
                  key={`chain-${activeChain?.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {Number(balance?.formatted).toPrecision(3)}
                  {` `}
                  {balance?.symbol}
                </Balance>
              )}
              {!balance && (
                <LoadingBalance
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  &nbsp;
                </LoadingBalance>
              )}
            </AnimatePresence>
          </BalanceContainer>
        </ModalBody>
      </ModalContent>
      <Button
        onClick={() => setShouldDisconnect(true)}
        icon={<DisconnectIcon />}
      >
        Disconnect
      </Button>
    </PageContent>
  );
};

export default Profile;
