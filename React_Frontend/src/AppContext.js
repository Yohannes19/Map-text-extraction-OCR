import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [resultsReceived, setResultsReceived] = useState(false);
  const [results, setResults] = useState([]);
  const [imgURLs, setImgURLs] = useState([]);
  // Add other states as needed

  return (
    <AppContext.Provider value={{ resultsReceived, setResultsReceived, results, setResults, imgURLs, setImgURLs }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
