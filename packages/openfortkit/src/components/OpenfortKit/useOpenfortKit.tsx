import React from 'react';
import { OpenfortKitContext } from './context';


export const useOpenfortKit = () => {
  const context = React.useContext(OpenfortKitContext);
  if (!context) throw Error('ConnectKit Hook must be inside a Provider.');
  return context;
};
