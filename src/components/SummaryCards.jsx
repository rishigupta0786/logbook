import { TrendingUp, TrendingDown, Filter } from 'lucide-react';

const SummaryCards = ({ totalIncome, totalExpense, balance, isFiltered }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      <div className="bg-white rounded-xl shadow-md p-3 text-center relative">
        {isFiltered && (
          <Filter size={14} className="absolute top-2 right-2 text-blue-500" />
        )}
        <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
          <TrendingUp size={18} />
          <h3 className="font-semibold text-xs sm:text-sm">
            {isFiltered ? 'Filtered Income' : 'Income'}
          </h3>
        </div>
        <p className="text-lg sm:text-xl font-bold">₹{totalIncome.toFixed(2)}</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-3 text-center relative">
        {isFiltered && (
          <Filter size={14} className="absolute top-2 right-2 text-blue-500" />
        )}
        <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
          <TrendingDown size={18} />
          <h3 className="font-semibold text-xs sm:text-sm">
            {isFiltered ? 'Filtered Expenses' : 'Expenses'}
          </h3>
        </div>
        <p className="text-lg sm:text-xl font-bold">₹{totalExpense.toFixed(2)}</p>
      </div>

      <div className={`rounded-xl shadow-md p-3 text-center relative ${balance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isFiltered && (
          <Filter size={14} className="absolute top-2 right-2 text-blue-500" />
        )}
        <h3 className="font-semibold text-xs sm:text-sm mb-1">
          {isFiltered ? 'Filtered Balance' : 'Balance'}
        </h3>
        <p className="text-lg sm:text-xl font-bold">₹{balance.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default SummaryCards;