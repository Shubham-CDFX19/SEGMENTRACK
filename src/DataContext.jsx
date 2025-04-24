import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [segmentationData, setSegmentationData] = useState({
    customer_segments: [],
    cluster_summary: [],
  });

  const updateSegmentationData = (data) => {
    setSegmentationData(data);
  };

  return (
    <DataContext.Provider value={{ segmentationData, updateSegmentationData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);