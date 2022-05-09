import React, { useEffect, useState } from 'react';
import { useContext } from './../FamilyKit';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import {
  useConnect,
  useDisconnect,
  useAccount,
  useEnsName,
  useBalance,
} from 'wagmi';
import {
  ModalBody,
  ModalContent,
  ModalH1,
  ModalHeading,
} from '../Modal/styles';
import localizations from '../../constants/localizations';
import Button from './../Button';
import { truncateEthAddress } from '../../utils';
import Avatar from './Avatar';
import ChainSelector from './ChainSelector';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;
const AvatarContainer = styled(motion.div)`
  padding: 30px 0 20px;
`;
const AvatarInner = styled(motion.div)`
  position: relative;
  display: inline-block;
`;
const ChainSelectorContainer = styled(motion.div)`
  z-index: 3;
  position: absolute;
  bottom: 0px;
  right: -16px;
`;

const DisconnectIcon = ({ ...props }) => {
  return (
    <svg
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 0C1.79086 0 0 1.79086 0 4V10C0 12.2091 1.79086 14 4 14H6C6.55228 14 7 13.5523 7 13C7 12.4477 6.55228 12 6 12H4C2.89543 12 2 11.1046 2 10V4C2 2.89543 2.89543 2 4 2H6C6.55228 2 7 1.55228 7 1C7 0.447715 6.55228 0 6 0H4ZM11.7071 3.29289C11.3166 2.90237 10.6834 2.90237 10.2929 3.29289C9.90237 3.68342 9.90237 4.31658 10.2929 4.70711L11.5858 6H9.5H6C5.44772 6 5 6.44772 5 7C5 7.55228 5.44772 8 6 8H9.5H11.5858L10.2929 9.29289C9.90237 9.68342 9.90237 10.3166 10.2929 10.7071C10.6834 11.0976 11.3166 11.0976 11.7071 10.7071L14.7071 7.70711C15.0976 7.31658 15.0976 6.68342 14.7071 6.29289L11.7071 3.29289Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
};

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
    if (!shouldDisconnect) return;
    setTimeout(() => {
      disconnect();
      reset();
    }, 1000);
  }, [shouldDisconnect]);

  if (!isConnected || shouldDisconnect)
    return (
      <Container>
        <ModalHeading>{copy.heading}</ModalHeading>
        <ModalContent>
          <ModalH1>Disconnecting...</ModalH1>
        </ModalContent>
      </Container>
    );
  return (
    <Container>
      <ModalHeading>{copy.heading}</ModalHeading>
      <ModalContent>
        <AvatarContainer>
          <AvatarInner>
            <ChainSelectorContainer>
              <ChainSelector />
            </ChainSelectorContainer>
            <Avatar address={account?.address} />
          </AvatarInner>
        </AvatarContainer>
        <ModalH1>
          {ensName ? ensName : truncateEthAddress(account?.address)}
        </ModalH1>
        <ModalBody>
          {Number(balance?.formatted).toPrecision(3)} {balance?.symbol}
        </ModalBody>
      </ModalContent>
      <Button
        onClick={() => setShouldDisconnect(true)}
        icon={
          <DisconnectIcon
            style={{
              transform: 'scale(0.75) ',
              left: 3,
              top: 0.5,
            }}
          />
        }
      >
        Disconnect
      </Button>
    </Container>
  );
};

export default Profile;
