import { useConnect as wagmiUseConnect } from 'wagmi';
import { useContext } from '../components/ConnectKit';

export function useConnect() {
  const context = useContext();
  const { connectAsync, connectors } = wagmiUseConnect({
    onError(err) {
      if (err.message) {
        if (err.message !== 'User rejected request') {
          context.debug(err.message, err);
        }
      } else {
        context.debug(`Could not connect..`, err);
      }
    },
  });
  return { connectAsync, connectors };
}
