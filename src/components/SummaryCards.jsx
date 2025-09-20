import { TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCards = ({ totalIncome, totalExpense, balance }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      <div className="bg-white rounded-xl shadow-md p-3 text-center">
        <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
          <TrendingUp size={18} />
          <h3 className="font-semibold text-xs sm:text-sm">Income</h3>
        </div>
        <p className="text-lg sm:text-xl font-bold">${totalIncome.toFixed(2)}</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-3 text-center">
        <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
          <TrendingDown size={18} />
          <h3 className="font-semibold text-xs sm:text-sm">Expenses</h3>
        </div>
        <p className="text-lg sm:text-xl font-bold">${totalExpense.toFixed(2)}</p>
      </div>

      <div className={`rounded-xl shadow-md p-3 text-center ${balance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        <h3 className="font-semibold text-xs sm:text-sm mb-1">Balance</h3>
        <p className="text-lg sm:text-xl font-bold">${balance.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default SummaryCards;