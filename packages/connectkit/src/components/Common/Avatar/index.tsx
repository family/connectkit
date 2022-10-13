import React, { useState, useEffect, useRef } from 'react';

import { EnsAvatar, ImageContainer } from './styles';

import { useEnsName, useEnsAvatar, useEnsAddress } from 'wagmi';
import { ResetContainer } from '../../../styles';
import { useContext } from '../../ConnectKit';

export type CustomAvatarProps = {
  address?: string;
  ensName?: string;
  ensImage?: string;
  size: number;
  radius: number;
};

const Avatar: React.FC<{
  address?: string;
  name?: string;
  size?: number;
  radius?: number;
}> = ({ address, name, size = 96, radius = 96 }) => {
  const context = useContext();

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

  if (context.options?.customAvatar)
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          overflow: 'hidden',
        }}
      >
        {context.options?.customAvatar({
          address: address ?? ens?.address,
          ensName: name ?? ens?.name,
          ensImage: ens?.avatar,
          size,
          radius,
        })}
      </div>
    );

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
