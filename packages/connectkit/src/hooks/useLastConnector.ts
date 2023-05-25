import { useLocalStorage } from './useLocalStorage';

export const useLastConnector = () => {
  const {
    data: lastConnectorId,
    add,
    update,
    clear,
  } = useLocalStorage('connectKit.lastConnectorId');

  const updateLastConnectorId = (id: string) => {
    if (lastConnectorId) {
      if (lastConnectorId === id) return;
      clear();
      update(id);
    } else {
      add(id);
    }
  };

  return {
    lastConnectorId,
    updateLastConnectorId,
  };
};
