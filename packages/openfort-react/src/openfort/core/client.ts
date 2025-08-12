import { Openfort as OpenfortClient, OpenfortSDKConfiguration } from '@openfort/openfort-js';


/**
 * Creates an instance of the Openfort client configured for Expo/React Native
 *
 * @param options Configuration options for the Openfort client
 * @returns Configured Openfort client instance
 *
 * @example
 * const client = createOpenfortClient({
 * });
 *
 * const token = await client.getAccessToken();
 */
export function createOpenfortClient({
  baseConfiguration,
  overrides,
  shieldConfiguration,
}: OpenfortSDKConfiguration): OpenfortClient {
  return new OpenfortClient({
    baseConfiguration,
    overrides: {
      ...overrides,
    },
    shieldConfiguration
  });
}

/**
 * Default Openfort client instance - should only be used internally
 * Applications should create their own client instances using createOpenfortClient
 */
let defaultClient: OpenfortClient | null = null;

/**
 * Gets or creates the default Openfort client instance
 * @internal
 */
export function getDefaultClient(options?: OpenfortSDKConfiguration): OpenfortClient {
  if (!defaultClient && options) {
    defaultClient = new OpenfortClient(options);
  }

  if (!defaultClient) {
    throw new Error('Openfort client not initialized. Make sure to wrap your app with OpenfortProvider.');
  }

  return defaultClient;
}

/**
 * Sets the default Openfort client instance
 * @internal
 */
export function setDefaultClient(client: OpenfortClient): void {
  defaultClient = client;
}