import React, { useState, useEffect, useRef } from 'react';

import { EnsAvatar, ImageContainer } from './styles';

import { useEnsName, useEnsAvatar, useEnsAddress } from 'wagmi';
import { ResetContainer } from '../../../styles';

const Avatar: React.FC<{
  address?: string | undefined;
  name?: string | undefined;
  size?: number;
  radius?: number;
}> = ({ address = undefined, name = undefined, size, radius }) => {
  const imageRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(true);

  const { data: ensName } = useEnsName({
    chainId: 1,
    address: address,
  });
  const { data: ensAddress } = useEnsAddress({
    chainId: 1,
    name: name,
  });
  const { data: ensAvatar } = useEnsAvatar({
    chainId: 1,
    addressOrName: address ?? name,
  });
  const ens = {
    address: ensAddress ?? address,
    name: ensName ?? name,
    avatar: ensAvatar ?? undefined,
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

  if (!ens.name || !ens.avatar)
    return (
      <ResetContainer style={{ pointerEvents: 'none' }}>
        <EnsAvatar $size={size} $seed={ens.address} $radius={radius} />
      </ResetContainer>
    );
  return (
    <ResetContainer style={{ pointerEvents: 'none' }}>
      <EnsAvatar $size={size} $seed={ens.address} $radius={radius}>
        <ImageContainer
          ref={imageRef}
          src={ens.avatar}
          alt={ens.name}
          onLoad={() => setLoaded(true)}
          $loaded={loaded}
        />
      </EnsAvatar>
    </ResetContainer>
  );
};

export default Avatar;
