// components/TransactionList.jsx
'use client';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { usePersons } from '../utils/PersonsContext';

const TransactionList = ({ logs, deleteLog, clearAllLogs }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { persons } = usePersons(); // Get persons from context

  const getPersonName = (personId) => {
    const person = persons.find(p => p.id === personId);
    return person ? person.name : 'Unknown';
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    
    try {
      // Handle both YYYY-MM-DD format and existing formatted dates
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return as-is if it's not a valid date
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Return as-is if formatting fails
    }
  };

  const handleClearAllClick = () => {
    setShowConfirmDialog(true);
  };

  const confirmClearAll = () => {
    clearAllLogs();
    setShowConfirmDialog(false);
  };

  const cancelClearAll = () => {
    setShowConfirmDialog(false);
  };

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
        <div className="p-6 text-center text-gray-500">
          No transactions yet. Tap the + button to add your first entry!
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <button
            onClick={handleClearAllClick}
            className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1 transition-colors"
          >
            <Trash2 size={16} /> 
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>
        
        {/* Remove max-h-[50vh] overflow-y-auto from this div */}
        <div className="divide-y">
          {logs.map((log) => (
            <div key={log.id} className="p-3 flex justify-between items-start hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                {/* Person Name as Title */}
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {getPersonName(log.person)}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    log.type === 'income' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {log.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </div>
                
                {/* Description as Second Line */}
                <p className="text-gray-600 text-sm mb-1 truncate">
                  {log.description}
                </p>
                
                {/* Date */}
                <p className="text-xs text-gray-500">
                  {formatDate(log.date)}
                </p>
              </div>
              
              {/* Amount and Delete Button */}
              <div className="flex items-center gap-2 ml-2">
                <p className={log.type === 'income' ? 'text-green-600 font-bold text-base' : 'text-red-600 font-bold text-base'}>
                  {log.type === 'income' ? '+' : '-'}₹{log.amount.toFixed(2)}
                </p>
                <button
                  onClick={() => deleteLog(log.id)}
                  className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                  title="Delete transaction"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-gray-800/30"
            onClick={cancelClearAll}
          />
          
          {/* Dialog Content */}
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Clear all transactions?
              </h3>
              <p className="text-gray-600 mb-6">
                This will delete all {logs.length} transactions permanently.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelClearAll}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClearAll}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionList;