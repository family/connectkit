import React from 'react';
import { Context } from './context';


export const useOpenfortCore = () => {
  const context = React.useContext(Context);
  if (!context)
    throw Error('useOpenfortContext Hook must be inside CoreOpenfortProvider.');
  return context;
};
