import React, { useEffect, useState } from 'react';
import { useContext } from '../FamilyKit';
import localizations from '../../constants/localizations';
import { truncateEthAddress } from '../../utils';

import {
  useConnect,
  useDisconnect,
  useAccount,
  useEnsName,
  useBalance,
} from 'wagmi';

import {
  Container,
  AvatarContainer,
  AvatarInner,
  ChainSelectorContainer,
} from './styles';

import {
  ModalBody,
  ModalContent,
  ModalH1,
  ModalHeading,
} from '../Modal/styles';
import Button from '../Button';
import Avatar from '../Avatar';
import ChainSelector from '../ConnectModal/ChainSelector';

import { DisconnectIcon } from '../../assets/icons';
import CopyToClipboard from '../CopyToClipboard';

const Profile: React.FC = () => {
  const context = useContext();
  const copy = localizations[context.lang].profileScreen;

  const { reset, isConnected } = useConnect();
  const { disconnect } = useDisconnect();

  const [shouldDisconnect, setShouldDisconnect] = useState(false);

  const { data: account } = useAccount();
  const { data: ensName } = useEnsName({ address: account?.address });
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

  return (
    <Container>
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
            {ensName ? ensName : truncateEthAddress(account?.address)}
          </CopyToClipboard>
        </ModalH1>
        <ModalBody>
          {balance ? (
            <>
              {Number(balance?.formatted).toPrecision(3)}
              {balance?.symbol}
            </>
          ) : (
            <>&nbsp;</>
          )}
        </ModalBody>
      </ModalContent>
      <Button
        onClick={() => setShouldDisconnect(true)}
        icon={<DisconnectIcon />}
      >
        Disconnect
      </Button>
    </Container>
  );
};

export default Profile;
