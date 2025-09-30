'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const PersonsContext = createContext();

export const PersonsProvider = ({ children }) => {
  const [persons, setPersons] = useState([]);

  // Load persons from localStorage on mount
  useEffect(() => {
    const savedPersons = localStorage.getItem('logbookPersons');
    if (savedPersons) {
      setPersons(JSON.parse(savedPersons));
    }
  }, []);

  // Save to localStorage whenever persons change
  useEffect(() => {
    localStorage.setItem('logbookPersons', JSON.stringify(persons));
  }, [persons]);

  const addPerson = (newPerson) => {
    setPersons(prev => [...prev, newPerson]);
  };

  const updatePerson = (personId, updatedName) => {
    setPersons(prev => prev.map(p => 
      p.id === personId ? { ...p, name: updatedName } : p
    ));
  };

  const deletePerson = (personId) => {
    setPersons(prev => prev.filter(p => p.id !== personId));
  };

  const refreshPersons = () => {
    const savedPersons = localStorage.getItem('logbookPersons');
    if (savedPersons) {
      setPersons(JSON.parse(savedPersons));
    }
  };

  return (
    <PersonsContext.Provider value={{
      persons,
      addPerson,
      updatePerson,
      deletePerson,
      refreshPersons
    }}>
      {children}
    </PersonsContext.Provider>
  );
};

export const usePersons = () => {
  const context = useContext(PersonsContext);
  if (!context) {
    throw new Error('usePersons must be used within a PersonsProvider');
  }
  return context;
};