import { useContext, useState } from "react";

const { createContext } = require("react");

const ContextHook = createContext();

export const ProviderContext = ({ children }) => {
  const [user, setUser] = useState();
  return (
    <ContextHook.Provider value={{ user, setUser }}>
      {children}
    </ContextHook.Provider>
  );
};

export const useData = () => {
  return useContext(ContextHook);
};
