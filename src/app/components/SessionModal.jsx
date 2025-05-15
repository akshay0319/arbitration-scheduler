'use client';
import { useEffect, useState } from 'react';

export default function SessionModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  sessionData,
  currentUser,
}) {
  const [formData, setFormData] = useState({
    caseNumber: '',
    date: '',
    time: '',
    arbitrator: currentUser,
    participants: '',
  });

  useEffect(() => {
    if (sessionData) {
      const dateObj = new Date(sessionData.datetime);
      setFormData({
        caseNumber: sessionData.caseNumber || '',
        date: dateObj.toISOString().split('T')[0],
        time: dateObj.toTimeString().slice(0, 5),
        arbitrator: sessionData.arbitrator || currentUser,
        participants: sessionData.participants || '',
      });
    }
  }, [sessionData, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const datetime = new Date(`${formData.date}T${formData.time}`);
    onSave({
      id: sessionData?.id || Date.now(),
      caseNumber: formData.caseNumber,
      datetime: datetime.toString(),
      arbitrator: formData.arbitrator,
      participants: formData.participants,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md border border-gray-300">
        <h2 className="text-xl font-bold mb-4">
          {sessionData?.id ? 'Update Session' : 'Create Session'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Case Number"
            value={formData.caseNumber}
            onChange={(e) =>
              setFormData({ ...formData, caseNumber: e.target.value })
            }
            required
          />

          <input
            type="date"
            className="w-full border p-2 rounded"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            required
          />

          <input
            type="time"
            className="w-full border p-2 rounded"
            value={formData.time}
            onChange={(e) =>
              setFormData({ ...formData, time: e.target.value })
            }
            required
          />

          <input
            className="w-full border p-2 rounded bg-gray-100 text-gray-600"
            value={formData.arbitrator}
            readOnly
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Participants Email IDs (comma-separated)"
            value={formData.participants}
            onChange={(e) =>
              setFormData({ ...formData, participants: e.target.value })
            }
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>

            {sessionData?.id && (
              <button
                type="button"
                onClick={() => onDelete(sessionData.id)} // ✅ Only triggers delete logic
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
