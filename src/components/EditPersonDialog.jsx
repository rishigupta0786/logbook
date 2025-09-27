const EditPersonDialog = ({ 
  editingPerson, 
  editPersonName, 
  onEditPersonNameChange, 
  onSave, 
  onCancel 
}) => {
  if (!editingPerson) return null;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSave();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-60">
      <div 
        className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Person</h3>
        
        <input
          type="text"
          value={editPersonName}
          onChange={(e) => onEditPersonNameChange(e.target.value)}
          onKeyPress={handleKeyPress}
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