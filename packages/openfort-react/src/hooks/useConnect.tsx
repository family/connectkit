/**
 * This is a wrapper around wagmi's useConnect hook that adds some
 * additional functionality.
 */

import {
  Connector,
  CreateConnectorFn,
  type UseConnectParameters,
  useConnect as wagmiUseConnect,
} from 'wagmi';
import { useOpenfortKit } from '../components/Openfort/useOpenfortKit';

export function useConnect({ ...props }: UseConnectParameters = {}) {
  const context = useOpenfortKit();

  const { connect, connectAsync, connectors, ...rest } = wagmiUseConnect({
    ...props,
    mutation: {
      ...props.mutation,
      onError(err) {
        if (err.message) {
          if (err.message !== 'User rejected request') {
            context.log(err.message, err);
          }
        } else {
          context.log(`Could not connect.`, err);
        }
      },
    },
  });

  return {
    connect: ({
      connector,
      chainId,
      mutation,
    }: {
      connector: CreateConnectorFn | Connector;
      chainId?: number;
      mutation?: UseConnectParameters['mutation'];
    }) => {
      return connect(
        {
          connector,
          chainId: chainId ?? context.uiConfig?.initialChainId,
        },
        mutation
      );
    },
    connectAsync: async ({
      connector,
      chainId,
      mutation,
    }: {
      connector: CreateConnectorFn | Connector;
      chainId?: number;
      mutation?: UseConnectParameters['mutation'];
    }) => {
      return connectAsync(
        {
          connector,
          chainId: chainId ?? context.uiConfig?.initialChainId,
        },
        mutation
      );
    },
    connectors,
    ...rest,
  };
}
