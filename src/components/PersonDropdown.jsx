import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const PersonDropdown = ({ 
  persons = [], 
  selectedPerson, 
  onSelectPerson, 
  onShowNewPersonInput,
  onEditPerson,
  onDeletePerson
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on component mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical breakpoint for mobile
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getSelectedPersonName = () => {
    if (!selectedPerson) return 'Select a person';
    const selected = persons.find(p => p.id === selectedPerson);
    return selected ? selected.name : 'Select a person';
  };

  const handlePersonSelect = (personId) => {
    onSelectPerson(personId);
    setIsDropdownOpen(false);
  };

  const handleEditClick = (personId, e) => {
    e.stopPropagation();
    onEditPerson(personId);
    setIsDropdownOpen(false);
  };

  const handleDeleteClick = (personId, e) => {
    e.stopPropagation();
    onDeletePerson(personId);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isDropdownOpen) setIsDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className="relative">
      {/* Dropdown trigger */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 text-left flex justify-between items-center"
      >
        <span className={selectedPerson ? "text-gray-700" : "text-gray-500"}>
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
            onClick={onShowNewPersonInput}
            className="flex items-center gap-2 p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 text-blue-600 font-medium"
          >
            <Plus size={16} />
            <span>Add New Person</span>
          </div>

          {/* Person list */}
          {persons.length > 0 ? (
            persons.map((person) => (
              <div
                key={person.id}
                onClick={() => handlePersonSelect(person.id)}
                className="group flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-700 font-medium flex-1">{person.name}</span>
                <div className={`flex gap-1 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                  <button
                    onClick={(e) => handleEditClick(person.id, e)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title={`Edit ${person.name}`}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(person.id, e)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title={`Delete ${person.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
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
  );
};

export default PersonDropdown;