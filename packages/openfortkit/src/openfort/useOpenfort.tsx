import React from 'react';
import { Context } from './context';


export const useOpenfort = () => {
  const context = React.useContext(Context);
  if (!context)
    throw Error('useOpenfortContext Hook must be inside OpenfortProvider.');
  return context;
};
