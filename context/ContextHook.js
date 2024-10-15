import { createContext, useContext, useState } from "react";

const ContextHook = createContext();

export const ProviderContext = ({ children }) => {
  const [user, setUser] = useState(null); // Default to null instead of undefined

  return (
    <ContextHook.Provider value={{ user, setUser }}>
      {children}
    </ContextHook.Provider>
  );
};

export const useData = () => {
  return useContext(ContextHook);
};
