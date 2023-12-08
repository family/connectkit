import { createStore } from 'mipd';

export const createMipd = () => {
  if (typeof window === 'undefined') return null;

  // Set up a MIPD Store, and request Providers.
  const store = createStore();
  const connectors: any[] = [];

  const providers = store.getProviders();

  providers.map((provider) => {
    connectors.push({
      uuid: provider.info.uuid,
      name: provider.info.name,
      icon: provider.info.icon,
      rdns: provider.info.rdns,
      provider: provider.provider,
    });
  });

  return {
    connectors,
    findConnectorByUUID: (uuid: string) =>
      connectors.find((c) => c.uuid === uuid),
    findConnectorByName: (name: string) =>
      connectors.find((c) => c.name === name),
  };
};
