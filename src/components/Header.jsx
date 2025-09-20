import { Wallet } from 'lucide-react';

const Header = () => {
  return (
    <header className="mb-4 text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
        <Wallet className="text-blue-600" /> 
        <span className="hidden sm:inline">Financial Log Book</span>
        <span className="sm:hidden">Log Book</span>
      </h1>
      <p className="text-gray-600 text-sm md:text-base mt-1">
        Track income & expenses
      </p>
    </header>
  );
};

export default Header;