import { Trash2 } from 'lucide-react';

const TransactionList = ({ logs, deleteLog, clearAllLogs }) => {
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
      <div className="flex justify-between items-center p-3 border-b">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <button
          onClick={clearAllLogs}
          className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
        >
          <Trash2 size={16} /> 
          <span className="hidden sm:inline">Clear All</span>
        </button>
      </div>
      
      <div className="divide-y max-h-[50vh] overflow-y-auto">
        {logs.map((log) => (
          <div key={log.id} className="p-3 flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{log.description}</p>
              <p className="text-xs text-gray-500">{log.date}</p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <p className={log.type === 'income' ? 'text-green-600 font-bold text-sm' : 'text-red-600 font-bold text-sm'}>
                {log.type === 'income' ? '+' : '-'}${log.amount.toFixed(2)}
              </p>
              <button
                onClick={() => deleteLog(log.id)}
                className="text-gray-400 hover:text-red-600 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;