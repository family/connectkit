import { Openfort as OpenfortClient, type OpenfortSDKConfiguration } from '@openfort/openfort-js'

/**
 * Creates a new {@link OpenfortClient} instance.
 *
 * @param config - Configuration options passed directly to the Openfort SDK constructor.
 * @returns A configured Openfort client instance.
 *
 * @example
 * ```ts
 * const client = createOpenfortClient({
 *   baseConfiguration: { publishableKey: 'pk_test_123' },
 * });
 *
 * const token = await client.getAccessToken();
 * ```
 */
export function createOpenfortClient(config: OpenfortSDKConfiguration): OpenfortClient {
  return new OpenfortClient(config)
}

/**
 * Default {@link OpenfortClient} instance used internally by the package.
 *
 * Applications should generally create their own client instances using {@link createOpenfortClient}.
 */
let defaultClient: OpenfortClient | null = null

/**
 * Gets or initialises the shared {@link OpenfortClient} instance.
 *
 * @param options - Optional configuration used when initialising the client for the first time.
 * @returns The shared Openfort client instance.
 * @throws If the default client has not been set and no configuration options are provided.
 *
 * @example
 * ```ts
 * setDefaultClient(createOpenfortClient({ baseConfiguration: { publishableKey: 'pk' } }));
 * const client = getDefaultClient();
 * ```
 */
export function getDefaultClient(options?: OpenfortSDKConfiguration): OpenfortClient {
  if (!defaultClient && options) {
    defaultClient = new OpenfortClient(options)
  }

  if (!defaultClient) {
    throw new Error('Openfort client not initialized. Make sure to wrap your app with OpenfortProvider.')
  }

  return defaultClient
}

/**
 * Sets the shared {@link OpenfortClient} instance.
 *
 * @param client - Pre-configured Openfort client to store as the default.
 *
 * @example
 * ```ts
 * const client = createOpenfortClient({ baseConfiguration: { publishableKey: 'pk' } });
 * setDefaultClient(client);
 * ```
 */
export function setDefaultClient(client: OpenfortClient): void {
  defaultClient = client
}
