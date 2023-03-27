/**
 * LocalStorage helper functions to save and retrieve data on a per-app basis
 * e.g recently connected wallets, transactions, etc.
 */

import { randomUUID } from 'crypto';

export const save = (storageKey: string, data: any[]) => {
  localStorage.setItem(storageKey, JSON.stringify(data));
  return get(storageKey);
};

export const get = (storageKey: string) => {
  const data = localStorage.getItem(storageKey);
  try {
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
      ckStoreKey: randomUUID(), // unique key to identify the item so we can remove it later
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
