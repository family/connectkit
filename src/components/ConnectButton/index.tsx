import React from 'react';
import { motion, Variants } from 'framer-motion';
import styled from 'styled-components';
import { Props } from 'framer-motion/types/types';
import { useAccount, useEnsName, useConnect } from 'wagmi';
import { truncateEthAddress } from '../utils';

const FamilyIcon = (props: Props) => (
  <motion.svg
    width={30}
    height={30}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width={30} height={30} rx={7.5} fill="#1A88F8" />
    <path
      d="M25.005 15.003a3.353 3.353 0 0 0-2.714-3.291v-.065a3.35 3.35 0 0 0-.636-6.642 3.357 3.357 0 0 0-3.286 2.672h-.08A3.361 3.361 0 0 0 15.002 5a3.362 3.362 0 0 0-3.286 2.672h-.08a3.353 3.353 0 1 0-3.922 3.97v.064A3.359 3.359 0 0 0 5 15.003a3.349 3.349 0 0 0 2.715 3.29v.066A3.35 3.35 0 0 0 8.35 25a3.352 3.352 0 0 0 3.285-2.678h.08A3.358 3.358 0 0 0 15.004 25a3.352 3.352 0 0 0 3.285-2.677h.081A3.358 3.358 0 0 0 21.655 25a3.35 3.35 0 0 0 .636-6.642v-.064a3.353 3.353 0 0 0 2.714-3.291Zm-4.621 4.594c0 .437-.35.787-.787.787h-9.189a.784.784 0 0 1-.786-.787v-9.189c0-.436.35-.786.786-.786h9.19c.436 0 .786.35.786.786v9.19Z"
      fill="#fff"
    />
  </motion.svg>
);

const containerVariants: Variants = {
  hover: {
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
  },
};

const Container = styled(motion.div)`
  padding: 6px 13px 6px 6px;
  color: #505669;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  border-radius: 12px;
  border: 1px solid #f4f4f4;
  background: #fff;
  cursor: pointer;
`;

type ConnectButtonProps = {
  /** onClick handler */
  onClick?: (e: any) => void;
};

const ConnectButton: React.FC<ConnectButtonProps> = ({ onClick }) => {
  const { data: account } = useAccount();
  const { data: ensName } = useEnsName({ address: account?.address });
  const { isConnected } = useConnect();

  return (
    <Container
      whileHover="hover"
      variants={containerVariants}
      onClick={onClick}
    >
      <FamilyIcon style={{ marginRight: 6 }} />
      {isConnected ? (
        <span>{ensName ?? truncateEthAddress(account?.address)}</span>
      ) : (
        <span>
          Connect with <span style={{ color: '#1a88f8' }}>Family</span>
        </span>
      )}
    </Container>
  );
};

export default ConnectButton;
