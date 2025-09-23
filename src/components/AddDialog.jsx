import { X, Plus, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const AddDialog = ({ isOpen, onClose, onAdd }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [person, setPerson] = useState('');
  const [showNewPersonInput, setShowNewPersonInput] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [persons, setPersons] = useState([]);

  // Load persons from localStorage on component mount
  useEffect(() => {
    const savedPersons = localStorage.getItem('logbookPersons');
    if (savedPersons) {
      setPersons(JSON.parse(savedPersons));
    } else {
      // Initialize with default persons if none exist
      const defaultPersons = [
        { id: 'self', name: 'Myself' }
      ];
      setPersons(defaultPersons);
      localStorage.setItem('logbookPersons', JSON.stringify(defaultPersons));
    }
  }, []);

  // Save persons to localStorage whenever persons change
  useEffect(() => {
    if (persons.length > 0) {
      localStorage.setItem('logbookPersons', JSON.stringify(persons));
    }
  }, [persons]);

  const addNewPerson = () => {
    if (!newPersonName.trim()) {
      alert('Please enter a person name');
      return;
    }

    const newPerson = {
      id: `person-${Date.now()}`,
      name: newPersonName.trim()
    };

    setPersons([...persons, newPerson]);
    setPerson(newPerson.id);
    setNewPersonName('');
    setShowNewPersonInput(false);
  };

  const handlePersonChange = (e) => {
    const value = e.target.value;
    if (value === 'new-person') {
      setShowNewPersonInput(true);
      setPerson('');
    } else {
      setPerson(value);
      setShowNewPersonInput(false);
    }
  };

  const handleSubmit = () => {
    if (!description.trim() || !amount.trim() || parseFloat(amount) <= 0 || !person) {
      alert('Please fill all fields with valid information');
      return;
    }

    // If user was creating a new person but didn't finish, create it now
    let finalPerson = person;
    if (showNewPersonInput && newPersonName.trim()) {
      const newPerson = {
        id: `person-${Date.now()}`,
        name: newPersonName.trim()
      };
      setPersons([...persons, newPerson]);
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
          {/* Person Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Person *
            </label>
            
            {!showNewPersonInput ? (
              <div className="space-y-2">
                <select
                  value={person}
                  onChange={handlePersonChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80"
                  required
                >
                  <option value="">Select a person</option>
                  {persons.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                  <option value="new-person" className="text-blue-600 font-medium">
                    + Add New Person
                  </option>
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter new person name"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80"
                    autoFocus
                  />
                  <button
                    onClick={addNewPerson}
                    className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg flex items-center justify-center"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={cancelNewPerson}
                    className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg flex items-center justify-center"
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
    </div>
  );
};

export default AddDialog;