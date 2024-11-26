import React, { FC, useState } from 'react';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, amount: number) => void; // Accept onSubmit function as prop
}

export const CreateCampaignModal: FC<CreateCampaignModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Call the onSubmit function passed from the parent component
    onSubmit(title, description, amount);

    // Close the modal after submission
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close modal if clicked outside the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20"
      onClick={handleOverlayClick}
    >
      <div className="bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 p-6 rounded-lg max-w-lg w-full shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Create Campaign</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black"
            ></textarea>
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Amount in SOL(max=10,000)"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="block w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
