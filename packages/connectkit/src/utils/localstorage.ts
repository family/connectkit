/**
 * LocalStorage helper functions to save and retrieve data on a per-app basis
 * e.g recently connected wallets, transactions, etc.
 */

//import { randomUUID as randomID } from 'crypto';
const randomID = () => {
  // TODO: use randomUUID when it's supported in all browsers
  // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
  // Until then, use this fallback
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const save = (storageKey: string, data: any[]) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    return get(storageKey);
  } catch (e) {
    return [];
  }
};

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

export const remove = (storageKey: string, item: any) => {
  const data = get(storageKey);
  const newData = data.filter((i: any) => i.ckStoreKey !== item.ckStoreKey);
  save(storageKey, newData);
  return get(storageKey);
};

export const clear = (storageKey: string) => {
  save(storageKey, []);
  return get(storageKey);
};
