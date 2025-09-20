'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SummaryCards from '@/components/SummaryCards';
import TransactionList from '@/components/TransactionList';
import AddButton from '@/components/AddButton';
import AddDialog from '@/components/AddDialog';
import { loadLogs, saveLogs } from '@/utils/storage';

export default function LogBookApp() {
  const [logs, setLogs] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setLogs(loadLogs());
  }, []);

  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

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

  const totalIncome = logs
    .filter(log => log.type === 'income')
    .reduce((sum, log) => sum + log.amount, 0);

  const totalExpense = logs
    .filter(log => log.type === 'expense')
    .reduce((sum, log) => sum + log.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        <SummaryCards 
          totalIncome={totalIncome} 
          totalExpense={totalExpense} 
          balance={balance} 
        />
        
        <TransactionList 
          logs={logs} 
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