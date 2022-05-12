import React, { useState, useEffect, useRef } from 'react';

import { EnsAvatar, ImageContainer } from './styles';

import { useEnsName, useEnsAvatar, useEnsAddress } from 'wagmi';

const Avatar: React.FC<{
  address?: string | undefined;
  name?: string | undefined;
  size?: number;
}> = ({ address = undefined, name = undefined, size }) => {
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

  if (!ens.name || !ens.avatar)
    return <EnsAvatar $size={size} $seed={ens.address} />;
  return (
    <EnsAvatar $size={size} $seed={ens.address}>
      <ImageContainer
        ref={imageRef}
        src={ens.avatar}
        alt={ens.name}
        onLoad={() => setLoaded(true)}
        $loaded={loaded}
      />
    </EnsAvatar>
  );
};

export default Avatar;
