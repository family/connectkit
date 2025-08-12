import React from 'react';
import { OpenfortKitContext } from './context';


export const useOpenfortKit = () => {
  const context = React.useContext(OpenfortKitContext);
  if (!context) throw Error('OpenfortKit Hook must be inside a Provider.');
  return context;
};
