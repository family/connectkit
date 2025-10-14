/**
 * LocalStorage helper functions to save and retrieve data on a per-app basis.
 *
 * Use these utilities to manage recently connected wallets, transactions, and other session data.
 */

//import { randomUUID as randomID } from 'crypto';
const randomID = () => {
  // OLD_TODO: use randomUUID when it's supported in all browsers
  // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
  // Until then, use this fallback
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/**
 * Persists an array of values to `localStorage` under the provided key.
 *
 * @param storageKey - Identifier used to store the serialised data.
 * @param data - Items to persist.
 * @returns The data that was successfully stored, or an empty array when storage fails.
 *
 * @example
 * ```ts
 * save('openfort:recent-wallets', ['0x1234']);
 * ```
 */
export const save = (storageKey: string, data: any[]) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    return get(storageKey);
  } catch (e) {
    return [];
  }
};

/**
 * Reads and deserialises items from `localStorage`.
 *
 * @param storageKey - Identifier used when the data was stored.
 * @returns The stored array, or an empty array if the key is missing or the payload is invalid.
 *
 * @example
 * ```ts
 * const wallets = get('openfort:recent-wallets');
 * ```
 */
export const get = (storageKey: string) => {
  try {
    const data = localStorage.getItem(storageKey);
    if (data) return JSON.parse(data);
    return [];
  } catch (e) {
    // error parsing data, reset
    save(storageKey, []);
    return [];
  }
};

/**
 * Adds a new item to the stored array and records metadata for future removal.
 *
 * @param storageKey - Identifier used for the stored array.
 * @param item - Item to persist.
 * @returns The updated stored array.
 *
 * @example
 * ```ts
 * add('openfort:recent-wallets', { address: '0x1234' });
 * ```
 */
export const add = (storageKey: string, item: any) => {
  const data = get(storageKey);
  const newData = [
    {
      ...item,
      ckStoreKey: randomID(), // unique key to identify the item so we can remove it later
      timestamp: new Date(),
    },
    ...data,
  ];
  save(storageKey, newData);
  return get(storageKey);
};

/**
 * Removes an existing item from the stored array.
 *
 * @param storageKey - Identifier used for the stored array.
 * @param item - Item to remove. The object's `ckStoreKey` is used to identify entries.
 * @returns The updated stored array.
 *
 * @example
 * ```ts
 * remove('openfort:recent-wallets', wallet);
 * ```
 */
export const remove = (storageKey: string, item: any) => {
  const data = get(storageKey);
  const newData = data.filter((i: any) => i.ckStoreKey !== item.ckStoreKey);
  save(storageKey, newData);
  return get(storageKey);
};

/**
 * Clears all stored items for the provided key.
 *
 * @param storageKey - Identifier used for the stored array.
 * @returns An empty array once the items have been removed.
 *
 * @example
 * ```ts
 * clear('openfort:recent-wallets');
 * ```
 */
export const clear = (storageKey: string) => {
  save(storageKey, []);
  return get(storageKey);
};
