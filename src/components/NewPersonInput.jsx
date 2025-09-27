import { Plus, X } from 'lucide-react';

const NewPersonInput = ({ 
  newPersonName, 
  onNewPersonNameChange, 
  onAddNewPerson, 
  onCancel 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onAddNewPerson();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter new person name"
          value={newPersonName}
          onChange={(e) => onNewPersonNameChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80"
          autoFocus
        />
        <button
          onClick={onAddNewPerson}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg flex items-center justify-center transition-colors"
          title="Add person"
        >
          <Plus size={20} />
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg flex items-center justify-center transition-colors"
          title="Cancel"
        >
          <X size={20} />
        </button>
      </div>
      <p className="text-xs text-gray-500">Press Enter or click + to add</p>
    </div>
  );
};

export default NewPersonInput;