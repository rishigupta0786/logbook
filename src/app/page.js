'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SummaryCards from '@/components/SummaryCards';
import TransactionList from '@/components/TransactionList';
import AddButton from '@/components/AddButton';
import AddDialog from '@/components/AddDialog';
import { loadLogs, saveLogs } from '@/utils/storage';
import { Search, X } from 'lucide-react';

export default function LogBookApp() {
  const [logs, setLogs] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [persons, setPersons] = useState([]);

  // Load logs from localStorage on component mount
  useEffect(() => {
    setLogs(loadLogs());
    
    // Load persons
    const savedPersons = localStorage.getItem('logbookPersons');
    if (savedPersons) {
      setPersons(JSON.parse(savedPersons));
    }
  }, []);

  // Save logs to localStorage whenever logs change
  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  // Filter logs based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLogs(logs);
    } else {
      const filtered = logs.filter(log => {
        const personName = getPersonName(log.person).toLowerCase();
        return personName.includes(searchTerm.toLowerCase());
      });
      setFilteredLogs(filtered);
    }
  }, [searchTerm, logs, persons]);

  const getPersonName = (personId) => {
    const person = persons.find(p => p.id === personId);
    return person ? person.name : 'Unknown';
  };

  const addLog = (logData) => {
    const newLog = {
      id: Date.now().toString(),
      ...logData,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setLogs([newLog, ...logs]);
    setIsDialogOpen(false);
  };

  const deleteLog = (id) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  const clearAllLogs = () => {
    if (confirm('Are you sure you want to delete all logs?')) {
      setLogs([]);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const totalIncome = logs
    .filter(log => log.type === 'income')
    .reduce((sum, log) => sum + log.amount, 0);

  const totalExpense = logs
    .filter(log => log.type === 'expense')
    .reduce((sum, log) => sum + log.amount, 0);

  const balance = totalIncome - totalExpense;

  // Calculate filtered totals for display
  const filteredIncome = filteredLogs
    .filter(log => log.type === 'income')
    .reduce((sum, log) => sum + log.amount, 0);

  const filteredExpense = filteredLogs
    .filter(log => log.type === 'expense')
    .reduce((sum, log) => sum + log.amount, 0);

  const filteredBalance = filteredIncome - filteredExpense;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        {/* Search Bar - Above Summary Cards */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions by person name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm md:text-base"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X size={20} className="text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            )}
          </div>
          
          {/* Search Results Info */}
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-600 flex justify-between items-center">
              <span>
                Showing {filteredLogs.length} of {logs.length} transactions
                {filteredLogs.length === 0 && (
                  <span className="text-red-500"> - No matches found</span>
                )}
              </span>
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
        
        {/* Summary Cards - Show filtered totals when searching */}
        <SummaryCards 
          totalIncome={searchTerm ? filteredIncome : totalIncome} 
          totalExpense={searchTerm ? filteredExpense : totalExpense} 
          balance={searchTerm ? filteredBalance : balance} 
          isFiltered={!!searchTerm}
        />
        
        <TransactionList 
          logs={searchTerm ? filteredLogs : logs} 
          deleteLog={deleteLog} 
          clearAllLogs={clearAllLogs} 
        />
        
        <AddButton onClick={() => setIsDialogOpen(true)} />
        
        <AddDialog 
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)} 
          onAdd={addLog} 
        />
      </div>
    </div>
  );
}