/**
 * This is a wrapper around wagmi's useConnect hook that adds some
 * additional functionality.
 */

import { useConnect as wagmiUseConnect } from 'wagmi';
import { useContext } from '../components/ConnectKit';
import { useLastConnector } from './useLastConnector';

export function useConnect({ ...props } = {}) {
  const context = useContext();

  const connectProps = {
    chainId: context.options?.initialChainId,
  };

  const { updateLastConnectorId } = useLastConnector();

  const { connect, connectAsync, connectors, ...rest } = wagmiUseConnect({
    onError(err) {
      if (err.message) {
        if (err.message !== 'User rejected request') {
          context.log(err.message, err);
        }
      } else {
        context.log(`Could not connect.`, err);
      }
    },
    onSuccess(data: any) {
      updateLastConnectorId(
        `${data?.connector?.id}-${data?.connector?.name}` ?? ''
      );
    },
    ...props,
    /*
    onSuccess: (data) => {
      context.onConnect?.({
        address: data.account,
        //chainId: data.chain.id,
        connectorId: data.connector?.id,
      });
    },
    */
  });

  return {
    connect: ({ ...opts }) => {
      return connect({
        ...opts,
        ...connectProps,
      });
    },
    connectAsync: async ({ ...opts }) => {
      return await connectAsync({
        ...opts,
        ...connectProps,
      });
    },
    connectors,
    ...rest,
  };
}
