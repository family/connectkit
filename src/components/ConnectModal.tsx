import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useProvider,
} from 'wagmi';
import styled from 'styled-components';
import { motion, Variants } from 'framer-motion';
import { useContext } from './FamilyKit';
import ConnectButton from './ConnectButton';
import { Props } from 'framer-motion/types/types';
import { useEffect, useState } from 'react';
import { Listener } from '@ethersproject/abstract-provider';
import QRCode from 'react-qr-code';

const CloseIcon = (props: Props) => (
  <motion.svg
    width={11}
    height={11}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.707 1.707A1 1 0 0 0 9.293.293L5.5 4.086 1.707.293A1 1 0 0 0 .293 1.707L4.086 5.5.293 9.293a1 1 0 1 0 1.414 1.414L5.5 6.914l3.793 3.793a1 1 0 0 0 1.414-1.414L6.914 5.5l3.793-3.793Z"
      fill="#3A3E51"
    />
  </motion.svg>
);

const Spinner = (props: Props) => (
  <motion.svg
    width={15}
    height={15}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask
      id="b"
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={15}
      height={15}
      fill="#000"
    >
      <path fill="#fff" d="M0 0h15v15H0z" />
      <path d="M12.09 10.484a5.486 5.486 0 0 1-2.967 2.264 5.468 5.468 0 0 1-3.725-.161 5.49 5.49 0 0 1-2.76-2.513 5.515 5.515 0 0 1 1.438-6.883 5.473 5.473 0 0 1 7.01.162 5.505 5.505 0 0 1-.001 0 5.473 5.473 0 0 0-7.009-.161 5.514 5.514 0 0 0-1.438 6.882 5.489 5.489 0 0 0 2.76 2.512 5.467 5.467 0 0 0 3.724.162 5.485 5.485 0 0 0 2.967-2.264Z" />
    </mask>
    <path
      d="M12.09 10.484a5.486 5.486 0 0 1-2.967 2.264 5.468 5.468 0 0 1-3.725-.161 5.49 5.49 0 0 1-2.76-2.513 5.515 5.515 0 0 1 1.438-6.883 5.473 5.473 0 0 1 7.01.162 5.505 5.505 0 0 1-.001 0 5.473 5.473 0 0 0-7.009-.161 5.514 5.514 0 0 0-1.438 6.882 5.489 5.489 0 0 0 2.76 2.512 5.467 5.467 0 0 0 3.724.162 5.485 5.485 0 0 0 2.967-2.264Z"
      stroke="url(#a)"
      strokeWidth={3}
      strokeLinejoin="round"
      mask="url(#b)"
    />
    <defs>
      <radialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(5.77829 1.60996 -1.61415 5.79332 7.483 7.5)"
      >
        <stop stopColor="#4786FF" stopOpacity={0} />
        <stop offset={0.292} stopColor="#4786FF" stopOpacity={0} />
        <stop offset={1} stopColor="#4786FF" />
      </radialGradient>
    </defs>
  </motion.svg>
);

const Container = styled(motion.div)`
  padding: 16px;
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
`;

const ConnectorsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 180px;
`;

const ConnectorsHeading = styled(motion.div)`
  color: #b3b3b3;
  margin-left: 8px;
  font-size: 12px;
  line-height: 32px;
  text-transform: uppercase;
`;

const ConnectorButton = styled(motion.div)`
  cursor: pointer;
  padding: 8px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  color: #505669;
  font-size: 14px;
  line-height: 17px;
  background: #ffffff;
  border-radius: 8px;
`;

const ConnectorContent = styled(motion.div)`
  margin-left: 16px;
  width: 256px;
  height: 256px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
`;

const ConnectorIcon = styled(motion.img)`
  margin-right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 6px; ;
`;

const BackgroundOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled(motion.div)`
  display: none;
  cursor: pointer;
  position: absolute;
  top: -24px;
  right: -24px;
`;

const TempLoading = styled(motion.div)``;

const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
    pointerEvents: 'none',
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.3,
    },
  },
  visible: {
    opacity: 1,
    pointerEvents: 'auto',
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.4,
    },
  },
};

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    pointerEvents: 'none',
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.3,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    pointerEvents: 'auto',
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.4,
      delay: 0.05,
    },
  },
};

function getConnectorIcon(id: string) {
  const connectorAssets = {
    injected: require('../assets/metamask@3x.png'),
    walletConnect: require('../assets/walletconnect@3x.png'),
    default: require('../assets/blank@3x.png'),
  };

  switch (id) {
    case 'injected':
      return connectorAssets.injected;
    case 'walletConnect':
      return connectorAssets.walletConnect;
    default:
      return connectorAssets.default;
  }
}

function ConnectModal() {
  const [tab, setTab] = useState<string>('metamask');
  const [walletConnectURI, setWalletConnectURI] = useState<string | null>(null);

  const context = useContext();
  const {
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
    reset,
    isConnected,
  } = useConnect();
  const { disconnect } = useDisconnect();

  function resetAll() {
    disconnect();
    reset();
  }

  function show() {
    context.setState({ open: true });
  }

  function hide() {
    context.setState({ open: false });
  }

  useEffect(() => {
    if (isConnected) hide();
  }, [isConnected]);

  const handleQRCode: Listener = (err, payload) => {
    if (err) console.log(err);
    const uri = payload.params[0];
    setWalletConnectURI(uri);
  };

  const startWalletConnect = async () => {
    const p = await connectors[1].getProvider();
    p.connect();
    p.connector.on('display_uri', handleQRCode);
  };

  return (
    <>
      <ConnectButton onClick={show} />
      <button onClick={resetAll} style={{ marginLeft: 12 }}>
        Disconnect Wallet
      </button>
      <BackgroundOverlay
        onClick={hide}
        initial={false}
        animate={context.state.open ? 'visible' : 'hidden'}
        variants={overlayVariants}
      />
      <Container
        initial={false}
        animate={context.state.open ? 'visible' : 'hidden'}
        variants={containerVariants}
        style={{
          x: '-50%',
          y: '-50%',
        }}
      >
        {/* <div>Connected to {ensName ?? account?.address}</div> */}
        <ConnectorsContainer>
          <ConnectorsHeading>Suggested</ConnectorsHeading>
          {connectors.map((x) => {
            return (
              <ConnectorButton
                key={x.id}
                // disabled={!x.ready}
                onClick={() => {
                  if (x.id === 'walletConnect') {
                    startWalletConnect();
                  } else {
                    connect(x);
                  }
                  setTab(x.id);
                }}
                initial={{ background: '#fff' }}
                whileHover={{ background: '#f8f8f8' }}
              >
                <ConnectorIcon src={getConnectorIcon(x.id)} />
                {x.name}
                {/* {isConnecting &&
                  pendingConnector?.id === x.id &&
                  ' (connecting)'} */}
              </ConnectorButton>
            );
          })}
          <ConnectorsHeading style={{ marginTop: 16 }}>Other</ConnectorsHeading>
        </ConnectorsContainer>
        <ConnectorContent>
          {tab === 'injected' && isConnecting ? (
            <motion.div style={{ opacity: 0.3 }}>Connecting...</motion.div>
          ) : null}
          {walletConnectURI && tab === 'walletConnect' ? (
            <QRCode value={walletConnectURI} />
          ) : null}
        </ConnectorContent>
        {/* {connectors.map((x) => (
          <button key={x.id} disabled={!x.ready} onClick={() => connect(x)}>
            {x.name}
            {isConnecting && pendingConnector?.id === x.id && ' (connecting)'}
          </button>
        ))} */}
        {/* <span></span>{error ? error.message : ''} */}
        <CloseButton onClick={hide}>
          <CloseIcon />
        </CloseButton>
      </Container>
    </>
  );
}

export default ConnectModal;
