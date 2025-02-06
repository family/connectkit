import { useState } from 'react';
import * as LocalStorage from '../utils/localstorage';

export const useLocalStorage = (storageKey: string) => {
  const [data, setData] = useState(LocalStorage.get(storageKey));

  const add = (item: any) => {
    const newItems = LocalStorage.add(storageKey, item);
    setData(newItems);
  };

  const update = (items: any) => {
    const newItems = LocalStorage.save(storageKey, items);
    setData(newItems);
  };

  const remove = (item: any) => {
    const newItems = LocalStorage.remove(storageKey, item);
    setData(newItems);
  };

  const clear = () => {
    const newItems = LocalStorage.save(storageKey, []);
    setData(newItems);
  };

  return { data, add, remove, update, clear };
};
