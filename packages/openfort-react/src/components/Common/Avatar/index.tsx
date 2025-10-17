import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { normalize } from 'viem/ens'

import { useEnsAddress, useEnsAvatar, useEnsName } from 'wagmi'
import { useEnsFallbackConfig } from '../../../hooks/useEnsFallbackConfig'
import useIsMounted from '../../../hooks/useIsMounted'
import { ResetContainer } from '../../../styles'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { EnsAvatar, ImageContainer } from './styles'

type Hash = `0x${string}`

export type CustomAvatarProps = {
  address?: Hash | undefined
  ensName?: string | undefined
  ensImage?: string
  size: number
  radius: number
}

const Avatar: React.FC<{
  address?: Hash | undefined
  name?: string | undefined
  size?: number
  radius?: number
}> = ({ address, name, size = 96, radius = 96 }) => {
  const isMounted = useIsMounted()
  const context = useOpenfort()

  const imageRef = useRef<any>(null)
  const [loaded, setLoaded] = useState(true)

  const ensFallbackConfig = useEnsFallbackConfig()
  const { data: ensAddress } = useEnsAddress({
    chainId: 1,
    name: name,
    config: ensFallbackConfig,
  })
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: address ?? ensAddress ?? undefined,
    config: ensFallbackConfig,
  })
  const { data: ensAvatar } = useEnsAvatar({
    chainId: 1,
    name: normalize(ensName ?? ''),
    config: ensFallbackConfig,
  })

  const ens = {
    address: ensAddress ?? address,
    name: ensName ?? name,
    avatar: ensAvatar ?? undefined,
  }

  useEffect(() => {
    if (!(imageRef.current?.complete && imageRef.current.naturalHeight !== 0)) {
      setLoaded(false)
    }
  }, [])

  if (!isMounted) return <div style={{ width: size, height: size, borderRadius: radius }} />

  if (context.uiConfig?.customAvatar)
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          overflow: 'hidden',
        }}
      >
        {context.uiConfig?.customAvatar({
          address: address ?? ens?.address,
          ensName: name ?? ens?.name,
          ensImage: ens?.avatar,
          size,
          radius,
        })}
      </div>
    )

  if (!ens.name || !ens.avatar)
    return (
      <ResetContainer style={{ pointerEvents: 'none' }}>
        <EnsAvatar $size={size} $seed={ens.address} $radius={radius} />
      </ResetContainer>
    )
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
  )
}

export default Avatar
