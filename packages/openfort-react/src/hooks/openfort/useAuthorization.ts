import { useCallback } from 'react';
import {
  parseSignature,
  type AuthorizationRequest,
  type SignedAuthorization,
  type Hex,
} from 'viem';
import { hashAuthorization } from 'viem/utils';

import { useOpenfortCore } from '../../openfort/useOpenfort';
import { OpenfortError, OpenfortErrorType } from '../../types';

export type SignAuthorizationParameters = AuthorizationRequest;

export type SignAuthorizationReturnType = SignedAuthorization;

export type SignAuthorizationOptions = {
  hashMessage: boolean;
  arrayifyMessage: boolean;
};

/**
 * Hook for signing EIP-7702 wallet authorizations
 *
 * This hook leverages the embedded Openfort client to sign authorization payloads prepared via viem.
 * It mirrors viem's `signAuthorization` behaviour while always returning the structured authorization object,
 * keeping private key management inside the Openfort SDK.
 *
 * @returns Helper with a `signAuthorization` function that signs authorizations with the active Openfort wallet
 *
 * @example
 * ```ts
 * import { prepareAuthorization } from 'viem/actions';
 * import { useAuthorization } from '@openfort/openfort-react';
 *
 * const { signAuthorization } = useAuthorization();
 *
 * const authorization = await prepareAuthorization(pimlicoClient, {
 *   account: eoaAccount.address,
 *   contractAddress: implementationAddress,
 * });
 *
 * const signedAuthorization = await signAuthorization({
 *   ...authorization,
 * });
 * ```
 */
export function useAuthorization() {
  const { client } = useOpenfortCore();

  const signAuthorization = useCallback(
    async (
      parameters: SignAuthorizationParameters,
      options: SignAuthorizationOptions = {
        hashMessage: false,
        arrayifyMessage: false,
      },
    ): Promise<SignAuthorizationReturnType> => {
      if (!client) {
        throw new OpenfortError(
          'Openfort client is not initialized.',
          OpenfortErrorType.CONFIGURATION_ERROR,
        );
      }

      const authorization = parameters;

      if (!authorization.contractAddress) {
        throw new OpenfortError(
          'Authorization is missing the contract address to sign.',
          OpenfortErrorType.VALIDATION_ERROR,
        );
      }

      const hash = hashAuthorization(authorization);

      try {
        const signature = await client.embeddedWallet.signMessage(hash, {
          hashMessage: options.hashMessage,
          arrayifyMessage: options.arrayifyMessage,
        });

        const { r, s, v, yParity } = parseSignature(signature as Hex);

        return {
          address: authorization.contractAddress,
          chainId: authorization.chainId,
          nonce: authorization.nonce,
          r,
          s,
          v,
          yParity,
        } as SignAuthorizationReturnType;
      } catch (error) {
        throw new OpenfortError(
          'Failed to sign authorization.',
          OpenfortErrorType.WALLET_ERROR,
          { error },
        );
      }
    },
    [client],
  );

  return { signAuthorization };
}
