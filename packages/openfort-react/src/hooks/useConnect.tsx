/**
 * Custom wrapper around {@link wagmiUseConnect} that adds Openfort specific logic.
 *
 * @param props - Optional configuration passed through to Wagmi's hook.
 * @returns Connection helpers augmented with Openfort defaults and logging.
 *
 * @example
 * ```ts
 * const { connect, connectors } = useConnect();
 * await connect({ connector: connectors[0] });
 * ```
 */

import {
  type Connector,
  type CreateConnectorFn,
  type UseConnectParameters,
  type UseConnectReturnType,
  useConnect as wagmiUseConnect,
} from 'wagmi'
import { useOpenfort } from '../components/Openfort/useOpenfort'

type CustomConnectParams = {
  connector: CreateConnectorFn | Connector
  chainId?: number
  mutation?: UseConnectParameters['mutation']
}

type CustomUseConnectReturnType = Omit<UseConnectReturnType, 'connect' | 'connectAsync'> & {
  connect: (params: CustomConnectParams) => void
  connectAsync: (params: CustomConnectParams) => Promise<unknown>
}

export function useConnect({ ...props }: UseConnectParameters = {}): CustomUseConnectReturnType {
  const context = useOpenfort()

  const { connect, connectAsync, connectors, ...rest } = wagmiUseConnect({
    ...props,
    mutation: {
      ...props.mutation,
      onError(err) {
        if (err.message) {
          if (err.message !== 'User rejected request') {
            context.log(err.message, err)
          }
        } else {
          context.log(`Could not connect.`, err)
        }
      },
    },
  })

  return {
    connect: ({
      connector,
      chainId,
      mutation,
    }: {
      connector: CreateConnectorFn | Connector
      chainId?: number
      mutation?: UseConnectParameters['mutation']
    }) => {
      return connect(
        {
          connector,
          chainId: chainId ?? context.uiConfig.initialChainId,
        },
        mutation
      )
    },
    connectAsync: async ({
      connector,
      chainId,
      mutation,
    }: {
      connector: CreateConnectorFn | Connector
      chainId?: number
      mutation?: UseConnectParameters['mutation']
    }) => {
      return connectAsync(
        {
          connector,
          chainId: chainId ?? context.uiConfig.initialChainId,
        },
        mutation
      )
    },
    connectors,
    ...rest,
  }
}
