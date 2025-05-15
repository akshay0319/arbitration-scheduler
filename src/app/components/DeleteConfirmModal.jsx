'use client';
export default function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 p-6 rounded-md shadow-md w-full max-w-xs text-center">
        <h2 className="text-lg font-semibold mb-4">Cancel Session?</h2>
        <p className="text-sm mb-6 text-gray-600">
          Are you sure you want to cancel this arbitration session?
        </p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300"
          >
            No
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
