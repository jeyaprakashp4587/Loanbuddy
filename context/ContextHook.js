import { useContext } from "react";

const { createContext } = require("react");

const ContextHook = createContext();

export const ProviderContext = ({ children }) => {
  return <ContextHook.Provider>{children}</ContextHook.Provider>;
};

export const useData = () => {
  return useContext(ContextHook);
};
