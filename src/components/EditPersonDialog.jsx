import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

const EditPersonDialog = ({ 
  editingPerson, 
  editPersonName, 
  onEditPersonNameChange, 
  onSave, 
  onCancel 
}) => {
  const inputRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  useEffect(() => {
    if (editingPerson && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingPerson]);

  if (!editingPerson) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-800/30 flex items-center justify-center p-4 z-60">
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Edit Person</h3>
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
          value={editPersonName}
          onChange={(e) => onEditPersonNameChange(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
          placeholder="Enter person name"
          autoFocus
        />
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPersonDialog;