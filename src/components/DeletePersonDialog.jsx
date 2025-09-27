import { Trash2 } from 'lucide-react';

const DeletePersonDialog = ({ 
  personToDelete, 
  onConfirm, 
  onCancel 
}) => {
  if (!personToDelete) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-60">
      <div 
        className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Delete {personToDelete.name}?
          </h3>
          
          <p className="text-gray-600 text-sm mb-4">
            This will permanently delete <strong>{personToDelete.name}</strong> and all their transactions. This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePersonDialog;