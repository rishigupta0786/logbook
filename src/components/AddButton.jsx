import { Plus } from 'lucide-react';

const AddButton = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6">
      <button
        onClick={onClick}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default AddButton;