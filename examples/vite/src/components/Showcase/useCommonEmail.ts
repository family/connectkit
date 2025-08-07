import { CommonEmail, CommonEmailContext } from "@/components/Showcase/CommonEmailContext";
import React from "react";

export const useCommonEmail = (): CommonEmail => {
  const context = React.useContext(CommonEmailContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a ContextProvider');
  }
  return context;
};
