import React, { useEffect, useState } from 'react';
import { All } from './../../types';
import { useQueryClient } from '@tanstack/react-query';

import styled from './../../styles/styled';
import { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import { useAccount, useBalance, useBlockNumber } from 'wagmi';
import useIsMounted from '../../hooks/useIsMounted';

import Chain from '../Common/Chain';
import { chainConfigs } from '../../constants/chainConfigs';
import ThemedButton from '../Common/ThemedButton';
import { nFormatter } from '../../utils';
import { useChains } from '../../hooks/useChains';
import { useChainIsSupported } from '../../hooks/useChainIsSupported';

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;
const PlaceholderKeyframes = keyframes`
  0%,100%{ opacity: 0.1; transform: scale(0.75); }
  50%{ opacity: 0.75; transform: scale(1.2) }
`;
const PulseContainer = styled.div`
  pointer-events: none;
  user-select: none;
  padding: 0 5px;
  span {
    display: inline-block;
    vertical-align: middle;
    margin: 0 2px;
    width: 3px;
    height: 3px;
    border-radius: 4px;
    background: currentColor;
    animation: ${PlaceholderKeyframes} 1000ms ease infinite both;
  }
`;

type BalanceProps = {
  hideIcon?: boolean;
  hideSymbol?: boolean;
};

export const Balance: React.FC<BalanceProps> = ({ hideIcon, hideSymbol }) => {
  const isMounted = useIsMounted();
  const [isInitial, setIsInitial] = useState(true);

  const { address, chain } = useAccount();
  const chains = useChains();
  const isChainSupported = useChainIsSupported(chain?.id);

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: balance, queryKey } = useBalance({
    address,
    chainId: chain?.id,
  });

  useEffect(() => {
    if (blockNumber ?? 0 % 5 === 0) queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryKey]);

  const currentChain = chainConfigs.find((c) => c.id === chain?.id);
  const state = `${
    !isMounted || balance?.formatted === undefined
      ? `balance-loading`
      : `balance-${currentChain?.id}-${balance?.formatted}`
  }`;

  useEffect(() => {
    setIsInitial(false);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={state}
          initial={
            balance?.formatted !== undefined && isInitial
              ? {
                  opacity: 1,
                }
              : { opacity: 0, position: 'absolute', top: 0, left: 0, bottom: 0 }
          }
          animate={{ opacity: 1, position: 'relative' }}
          exit={{
            opacity: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
          }}
          transition={{
            duration: 0.4,
            ease: [0.25, 1, 0.5, 1],
            delay: 0.4,
          }}
        >
          {!address || !isMounted || balance?.formatted === undefined ? (
            <Container>
              {!hideIcon && <Chain id={chain?.id} />}
              <span style={{ minWidth: 32 }}>
                <PulseContainer>
                  <span style={{ animationDelay: '0ms' }} />
                  <span style={{ animationDelay: '50ms' }} />
                  <span style={{ animationDelay: '100ms' }} />
                </PulseContainer>
              </span>
            </Container>
          ) : !isChainSupported ? (
            <Container>
              {!hideIcon && <Chain id={chain?.id} />}
              <span style={{ minWidth: 32 }}>???</span>
            </Container>
          ) : (
            <Container>
              {!hideIcon && <Chain id={chain?.id} />}
              <span style={{ minWidth: 32 }}>
                {nFormatter(Number(balance?.formatted))}
              </span>
              {!hideSymbol && ` ${balance?.symbol}`}
            </Container>
          )}
        </motion.div>
      </AnimatePresence>
      {/* <Container
        style={{
          position: 'absolute',
          x: 'calc(-50% - 12px)',
          y: '-50%',
          left: '50%',
          top: '50%',
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: balance?.formatted !== undefined ? 1 : 0,
        }}
        transition={{
          duration: balance && isInitial ? 0 : 0.4,
          ease: [0.25, 1, 0.5, 1],
        }}
      >
        {!hideIcon && <Chain id={chain?.id} />}
        {nFormatter(Number(balance?.formatted))}
        {!hideSymbol && ` ${balance?.symbol}`}
      </Container> */}
    </div>
  );
};

const BalanceButton: React.FC<All & BalanceProps> = ({
  theme,
  mode,
  customTheme,
  hideIcon,
  hideSymbol,
}) => {
  return (
    <ThemedButton
      duration={0.4}
      variant={'secondary'}
      theme={theme}
      mode={mode}
      customTheme={customTheme}
    >
      <Balance hideIcon={hideIcon} hideSymbol={hideSymbol} />
    </ThemedButton>
  );
};
export default BalanceButton;
