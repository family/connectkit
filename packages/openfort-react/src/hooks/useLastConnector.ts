import { useEffect, useState } from 'react';
import { useConfig } from 'wagmi';

export const useLastConnector = () => {
  const { storage } = useConfig();
  const [lastConnectorId, setLastConnectorId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const id = await storage?.getItem('recentConnectorId');
      setLastConnectorId(id ?? '');
    };
    init();
  }, []);

  const update = (id: string) => {
    storage?.setItem('recentConnectorId', id);
  };

  return {
    lastConnectorId,
    updateLastConnectorId: update,
  };
};
