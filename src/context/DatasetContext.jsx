import { createContext, useContext, useState } from 'react';
import { datasets as initialMockDatasets, matchingJobs as initialMockJobs } from '../data/mockData';

const DatasetContext = createContext();

export function DatasetProvider({ children }) {
  // Use mock datasets initially for hackathon demo purposes
  const [datasets, setDatasets] = useState(initialMockDatasets);
  const [matchingJobs, setMatchingJobs] = useState(initialMockJobs);

  const addDataset = (newDataset) => {
    setDatasets(prev => [newDataset, ...prev]);
  };
  
  const addMatchingJob = (newJob) => {
    setMatchingJobs(prev => [newJob, ...prev]);
  };
  
  const updateMatchingJob = (jobId, updates) => {
    setMatchingJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    ));
  };

  return (
    <DatasetContext.Provider value={{ 
      datasets, 
      addDataset, 
      matchingJobs, 
      addMatchingJob,
      updateMatchingJob
    }}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDatasets() {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error('useDatasets must be used within a DatasetProvider');
  }
  return context;
}
