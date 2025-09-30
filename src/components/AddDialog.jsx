// components/AddDialog.jsx
'use client';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import PersonDropdown from './PersonDropdown';
import NewPersonInput from './NewPersonInput';
import EditPersonDialog from './EditPersonDialog';
import DeletePersonDialog from './DeletePersonDialog';
import { usePersons } from '../utils/PersonsContext';

const AddDialog = ({ isOpen, onClose, onAdd, onPersonDelete }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [person, setPerson] = useState('');
  const [date, setDate] = useState('');
  const [showNewPersonInput, setShowNewPersonInput] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [personToDelete, setPersonToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [editPersonName, setEditPersonName] = useState('');

  // Use context for persons
  const { persons, addPerson, updatePerson, deletePerson } = usePersons();

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  // Reset date when dialog opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [isOpen]);

  // Simplified person management functions
  const addNewPerson = () => {
    if (!newPersonName.trim()) {
      alert('Please enter a person name');
      return;
    }

    const newPerson = {
      id: `person-${Date.now()}`,
      name: newPersonName.trim()
    };

    addPerson(newPerson); // Use context function
    setPerson(newPerson.id);
    setNewPersonName('');
    setShowNewPersonInput(false);
  };

  const editPerson = (personId, newName) => {
    if (!newName.trim()) {
      alert('Please enter a valid name');
      return false;
    }

    updatePerson(personId, newName.trim()); // Use context function
    return true;
  };

  const deletePersonAndTransactions = (personId) => {
    try {
      const savedLogs = localStorage.getItem('logbookEntries');
      
      if (!savedLogs) return { success: false };
      
      const logs = JSON.parse(savedLogs);
      const updatedLogs = logs.filter(log => log.person !== personId);
      
      localStorage.setItem('logbookEntries', JSON.stringify(updatedLogs));
      deletePerson(personId); // Use context function
      
      return { 
        success: true, 
        updatedLogs,
        deletedTransactionsCount: logs.length - updatedLogs.length
      };
    } catch (error) {
      console.error('Error deleting person:', error);
      return { success: false };
    }
  };

  // Event handlers
  const handleEditPerson = (personId) => {
    const personToEdit = persons.find(p => p.id === personId);
    if (personToEdit) {
      setEditingPerson(personToEdit);
      setEditPersonName(personToEdit.name);
    }
  };

  const handleDeletePerson = (personId) => {
    const personToDelete = persons.find(p => p.id === personId);
    if (personToDelete) {
      setPersonToDelete(personToDelete);
      setShowDeleteConfirm(true);
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

  const confirmDeletePerson = () => {
    if (personToDelete) {
      const result = deletePersonAndTransactions(personToDelete.id);
      if (result.success && onPersonDelete) {
        onPersonDelete(result.updatedLogs);
      }
      
      if (person === personToDelete.id) {
        setPerson('');
      }
    }
    setShowDeleteConfirm(false);
    setPersonToDelete(null);
  };

  const handleSubmit = () => {
    if (!description.trim() || !amount.trim() || parseFloat(amount) <= 0 || !person || !date) {
      alert('Please fill all fields with valid information');
      return;
    }

    let finalPerson = person;
    if (showNewPersonInput && newPersonName.trim()) {
      addNewPerson();
      finalPerson = person;
    }

    onAdd({
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      person: finalPerson,
      date: date
    });

    // Reset form
    setDescription('');
    setAmount('');
    setType('expense');
    setPerson('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowNewPersonInput(false);
    setNewPersonName('');
  };

  const cancelNewPerson = () => {
    setShowNewPersonInput(false);
    setNewPersonName('');
    setPerson('');
  };

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
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80"
              required
            />
          </div>

          {/* Person Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Person *
            </label>
            
            {!showNewPersonInput ? (
              <PersonDropdown
                persons={persons}
                selectedPerson={person}
                onSelectPerson={setPerson}
                onShowNewPersonInput={() => setShowNewPersonInput(true)}
                onEditPerson={handleEditPerson}
                onDeletePerson={handleDeletePerson}
              />
            ) : (
              <NewPersonInput
                newPersonName={newPersonName}
                onNewPersonNameChange={setNewPersonName}
                onAddNewPerson={addNewPerson}
                onCancel={cancelNewPerson}
              />
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

      {/* Edit Person Dialog */}
      <EditPersonDialog
        editingPerson={editingPerson}
        editPersonName={editPersonName}
        onEditPersonNameChange={setEditPersonName}
        onSave={saveEdit}
        onCancel={() => {
          setEditingPerson(null);
          setEditPersonName('');
        }}
      />

      {/* Delete Person Dialog */}
      <DeletePersonDialog
        personToDelete={personToDelete}
        onConfirm={confirmDeletePerson}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setPersonToDelete(null);
        }}
      />
    </div>
  );
};

export default AddDialog;