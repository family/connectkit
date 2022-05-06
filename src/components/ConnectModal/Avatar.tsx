import React, { useState, useEffect, useRef } from 'react';

import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

import { useEnsName, useEnsAvatar, useEnsAddress } from 'wagmi';

function addressToNumber(address: string) {
  return (
    (address
      .split('')
      .map((l) => l.charCodeAt(0))
      .reduce((a, b) => a + b) %
      100) /
    100
  );
}

const Image = styled(motion.img)<{ $loaded: boolean }>`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  opacity: ${(props) => (props.$loaded ? 1 : 0)};
  transition: opacity 500ms ease;
`;

const EnsAvatar = styled(motion.div)<{ $seed?: string }>`
  pointer-events: none;
  user-select: none;
  position: relative;
  overflow: hidden;
  margin: 0;
  border-radius: 50%;
  width: 96px;
  height: 96px;
  background: var(--body-background-secondary);
  ${(props) => {
    if (props.$seed) {
      const ensColor = `0${Math.ceil(addressToNumber(props.$seed) * 8)}`;
      return css`
        background: var(--ens-${ensColor}-start);
        background: linear-gradient(
          180deg,
          var(--ens-${ensColor}-start) 0%,
          var(--ens-${ensColor}-stop) 100%
        );
      `;
    }
  }}
`;

const Avatar: React.FC<{
  address?: string | undefined;
  name?: string | undefined;
}> = ({ address = undefined, name = undefined }) => {
  const imageRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(true);

  const { data: ensName } = useEnsName({ address: address });
  const { data: ensAddress } = useEnsAddress({ name: name });
  const { data: ensAvatar } = useEnsAvatar({
    addressOrName: address ? address : name,
  });
  const ens = {
    address: ensAddress ? ensAddress : address,
    name: ensName ? ensName : name,
    avatar: ensAvatar ? ensAvatar : undefined,
  };

  useEffect(() => {
    if (
      !(
        imageRef.current &&
        imageRef.current.complete &&
        imageRef.current.naturalHeight !== 0
      )
    ) {
      setLoaded(false);
    }
  }, [ensAvatar]);

  if (!ens.name || !ens.avatar) return <EnsAvatar $seed={ens.address} />;
  return (
    <EnsAvatar $seed={ens.address}>
      <Image
        ref={imageRef}
        src={ens.avatar}
        title={ens.address}
        alt={ens.name}
        onLoad={() => setLoaded(true)}
        $loaded={loaded}
      />
    </EnsAvatar>
  );
};

export default Avatar;
