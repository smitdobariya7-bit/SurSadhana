import { useState, useContext, createContext } from 'react';

// Create context for notation mode
const NotationContext = createContext();

export const useNotationMode = () => {
  const context = useContext(NotationContext);
  if (!context) {
    // Fallback if not in provider
    const [mode, setMode] = useState('both');
    return { mode, setMode };
  }
  return context;
};

export const NotationProvider = ({ children }) => {
  const [mode, setMode] = useState('both');

  return (
    <NotationContext.Provider value={{ mode, setMode }}>
      {children}
    </NotationContext.Provider>
  );
};

export default NotationContext;
