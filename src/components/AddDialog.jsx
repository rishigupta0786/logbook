import { X, Plus, Trash2, User, MoreVertical, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';

const AddDialog = ({ isOpen, onClose, onAdd, onPersonDelete }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [person, setPerson] = useState('');
  const [showNewPersonInput, setShowNewPersonInput] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [persons, setPersons] = useState([]);
  const [personToDelete, setPersonToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [actionMenu, setActionMenu] = useState({ open: false, personId: null, position: { x: 0, y: 0 } });
  const [editingPerson, setEditingPerson] = useState(null);
  const [editPersonName, setEditPersonName] = useState('');

  // Load persons from localStorage on component mount
  useEffect(() => {
    const savedPersons = localStorage.getItem('logbookPersons');
    if (savedPersons) {
      setPersons(JSON.parse(savedPersons));
    }
  }, []);

  // Function to delete a person and their transactions
  const deletePersonAndTransactions = (personId) => {
    try {
      // Get current data from localStorage
      const savedLogs = localStorage.getItem('logbookEntries');
      const savedPersons = localStorage.getItem('logbookPersons');
      
      if (!savedLogs || !savedPersons) return { success: false };
      
      const logs = JSON.parse(savedLogs);
      const currentPersons = JSON.parse(savedPersons);
      
      // Filter out the person to be deleted
      const updatedPersons = currentPersons.filter(p => p.id !== personId);
      
      // Filter out transactions associated with the person
      const updatedLogs = logs.filter(log => log.person !== personId);
      
      // Save back to localStorage
      localStorage.setItem('logbookEntries', JSON.stringify(updatedLogs));
      localStorage.setItem('logbookPersons', JSON.stringify(updatedPersons));
      
      return { 
        success: true, 
        updatedLogs, 
        updatedPersons,
        deletedTransactionsCount: logs.length - updatedLogs.length
      };
    } catch (error) {
      console.error('Error deleting person:', error);
      return { success: false };
    }
  };

  // Function to edit a person's name
  const editPerson = (personId, newName) => {
    if (!newName.trim()) {
      alert('Please enter a valid name');
      return false;
    }

    try {
      const savedPersons = localStorage.getItem('logbookPersons');
      if (!savedPersons) return false;

      const currentPersons = JSON.parse(savedPersons);
      const updatedPersons = currentPersons.map(p => 
        p.id === personId ? { ...p, name: newName.trim() } : p
      );

      setPersons(updatedPersons);
      localStorage.setItem('logbookPersons', JSON.stringify(updatedPersons));

      // Update selected person if it's the one being edited
      if (person === personId) {
        setPerson(personId); // This will refresh the display
      }

      return true;
    } catch (error) {
      console.error('Error editing person:', error);
      return false;
    }
  };

  const addNewPerson = () => {
    if (!newPersonName.trim()) {
      alert('Please enter a person name');
      return;
    }

    const newPerson = {
      id: `person-${Date.now()}`,
      name: newPersonName.trim()
    };

    const updatedPersons = persons ? [...persons, newPerson] : [newPerson];
    setPersons(updatedPersons);
    localStorage.setItem('logbookPersons', JSON.stringify(updatedPersons));
    setPerson(newPerson.id);
    setNewPersonName('');
    setShowNewPersonInput(false);
    setIsDropdownOpen(false);
  };

  const handlePersonSelect = (personId) => {
    setPerson(personId);
    setIsDropdownOpen(false);
  };

  const handleActionMenuClick = (personId, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const rect = e.currentTarget.getBoundingClientRect();
    setActionMenu({
      open: true,
      personId,
      position: { x: rect.left, y: rect.bottom + 5 }
    });
  };

  const closeActionMenu = () => {
    setActionMenu({ open: false, personId: null, position: { x: 0, y: 0 } });
  };

  const handleEditClick = (personId) => {
    const personToEdit = persons.find(p => p.id === personId);
    if (personToEdit) {
      setEditingPerson(personToEdit);
      setEditPersonName(personToEdit.name);
      closeActionMenu();
    }
  };

  const handleDeleteClick = (personId) => {
    const personToDelete = persons.find(p => p.id === personId);
    if (personToDelete) {
      setPersonToDelete(personToDelete);
      setShowDeleteConfirm(true);
      closeActionMenu();
    }
  };

  const saveEdit = () => {
    if (editingPerson && editPersonName.trim()) {
      const success = editPerson(editingPerson.id, editPersonName);
      if (success) {
        setEditingPerson(null);
        setEditPersonName('');
      }
    }
  };

  const cancelEdit = () => {
    setEditingPerson(null);
    setEditPersonName('');
  };

  const confirmDeletePerson = () => {
    if (personToDelete) {
      const result = deletePersonAndTransactions(personToDelete.id);
      if (result.success) {
        // Update local state
        const updatedPersons = persons.filter(p => p.id !== personToDelete.id);
        setPersons(updatedPersons);
        
        // Notify parent component about the deletion
        if (onPersonDelete) {
          onPersonDelete(result.updatedLogs, updatedPersons);
        }
        
        // Reset person selection if the deleted person was selected
        if (person === personToDelete.id) {
          setPerson('');
        }
      }
    }
    setShowDeleteConfirm(false);
    setPersonToDelete(null);
  };

  const cancelDeletePerson = () => {
    setShowDeleteConfirm(false);
    setPersonToDelete(null);
  };

  const handleSubmit = () => {
    if (!description.trim() || !amount.trim() || parseFloat(amount) <= 0 || !person) {
      alert('Please fill all fields with valid information');
      return;
    }

    let finalPerson = person;
    if (showNewPersonInput && newPersonName.trim()) {
      const newPerson = {
        id: `person-${Date.now()}`,
        name: newPersonName.trim()
      };
      const updatedPersons = persons ? [...persons, newPerson] : [newPerson];
      setPersons(updatedPersons);
      localStorage.setItem('logbookPersons', JSON.stringify(updatedPersons));
      finalPerson = newPerson.id;
    }

    onAdd({
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      person: finalPerson
    });

    // Reset form
    setDescription('');
    setAmount('');
    setType('expense');
    setPerson('');
    setShowNewPersonInput(false);
    setNewPersonName('');
    setIsDropdownOpen(false);
  };

  const cancelNewPerson = () => {
    setShowNewPersonInput(false);
    setNewPersonName('');
    setPerson('');
    setIsDropdownOpen(false);
  };

  const getSelectedPersonName = () => {
    if (!person) return 'Select a person';
    const selected = persons.find(p => p.id === person);
    return selected ? selected.name : 'Select a person';
  };

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (actionMenu.open) {
        closeActionMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [actionMenu.open]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Semi-transparent overlay */}
      <div 
        className="absolute inset-0 bg-gray-800/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog content */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-xl shadow-lg w-full max-w-md p-5 border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Person Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Person *
            </label>
            
            {!showNewPersonInput ? (
              <div className="relative">
                {/* Custom dropdown trigger */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 text-left flex justify-between items-center"
                >
                  <span className={person ? "text-gray-700" : "text-gray-500"}>
                    {getSelectedPersonName()}
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {/* Add New Person option */}
                    <div
                      onClick={() => setShowNewPersonInput(true)}
                      className="flex items-center gap-2 p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 text-blue-600 font-medium"
                    >
                      <Plus size={16} />
                      <span>Add New Person</span>
                    </div>

                    {/* Person list with 3-dot menu buttons */}
                    {persons && persons.length > 0 ? (
                      persons.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handlePersonSelect(p.id)}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 group"
                        >
                          <span className="text-gray-700 font-medium">{p.name}</span>
                          <button
                            onClick={(e) => handleActionMenuClick(p.id, e)}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100"
                            title={`Actions for ${p.name}`}
                          >
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500 text-sm">
                        No persons added yet
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter new person name"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addNewPerson()}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80"
                    autoFocus
                  />
                  <button
                    onClick={addNewPerson}
                    className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg flex items-center justify-center transition-colors"
                    title="Add person"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={cancelNewPerson}
                    className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg flex items-center justify-center transition-colors"
                    title="Cancel"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Press Enter or click + to add</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <input
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80"
              required
            />
          </div>
          
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80"
              required
            />
          </div>
          
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80"
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Add Entry
          </button>
        </div>
      </div>

      {/* Action Menu Popup */}
      {actionMenu.open && (
        <div 
          className="fixed z-60 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]"
          style={{
            left: actionMenu.position.x,
            top: actionMenu.position.y
          }}
        >
          <button
            onClick={() => handleEditClick(actionMenu.personId)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Edit size={14} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleDeleteClick(actionMenu.personId)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Edit Person Dialog */}
      {editingPerson && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-60">
          <div 
            className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm"
            onClick={cancelEdit}
          />
          
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Person</h3>
            
            <input
              type="text"
              value={editPersonName}
              onChange={(e) => setEditPersonName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
              placeholder="Enter person name"
              autoFocus
            />
            
            <div className="flex gap-3">
              <button
                onClick={cancelEdit}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Person Confirmation Dialog */}
      {showDeleteConfirm && personToDelete && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-60">
          <div 
            className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm"
            onClick={cancelDeletePerson}
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
                  onClick={cancelDeletePerson}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeletePerson}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDialog;