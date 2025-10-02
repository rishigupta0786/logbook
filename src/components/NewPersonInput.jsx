import { Plus, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

const NewPersonInput = ({ 
  newPersonName, 
  onNewPersonNameChange, 
  onAddNewPerson, 
  onCancel,
  isOpen = false
}) => {
  const inputRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onAddNewPerson();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-gray-800/30 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Add New Person</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={newPersonName}
          onChange={(e) => onNewPersonNameChange(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
          placeholder="Enter new person name"
          autoFocus
        />
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            onClick={onAddNewPerson}
            disabled={!newPersonName.trim()}
            className="flex-1 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-3">
          Press Enter to add or Escape to cancel
        </p>
      </div>
    </div>
  );
};

export default NewPersonInput;