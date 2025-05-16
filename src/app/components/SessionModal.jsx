'use client';
import { useEffect, useState } from 'react';

const timeOptions = Array.from({ length: 10 }, (_, i) => {
  const hour = i + 9;
  return `${hour.toString().padStart(2, '0')}:00`;
});

export default function SessionModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  sessionData,
  currentUser,
  sessions,
  readOnly = false,
}) {
  const [formData, setFormData] = useState({
    caseNumber: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    arbitrator: currentUser,
    claimantEmail: '',
    respondentEmail: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !sessionData) return;
    const dateObj = new Date(sessionData.datetime);
    setFormData({
      caseNumber: sessionData.caseNumber || '',
      date: dateObj.toISOString().split('T')[0],
      startTime: sessionData.startTime || '09:00',
      endTime: sessionData.endTime || '10:00',
      arbitrator: sessionData.arbitrator || currentUser,
      claimantEmail: sessionData.claimantEmail || '',
      respondentEmail: sessionData.respondentEmail || '',
    });
  }, [sessionData, currentUser, mounted]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const datetime = new Date(`${formData.date}T${formData.startTime}`);
    const endDatetime = new Date(`${formData.date}T${formData.endTime}`);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (endDatetime <= datetime) {
      setErrorMessage('End time must be after start time');
      return;
    }

    if (!emailRegex.test(formData.claimantEmail)) {
      setErrorMessage('Invalid Claimant Email');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (!emailRegex.test(formData.respondentEmail)) {
      setErrorMessage('Invalid Respondent Email');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    const selectedStart = new Date(`${formData.date}T${formData.startTime}`);
    const selectedEnd = new Date(`${formData.date}T${formData.endTime}`);

    const isOverlapping = sessions.some((s) => {
      if (sessionData?.id === s.id) return false;

      const sDate = new Date(s.datetime);
      const sessionStart = new Date(`${sDate.toDateString()} ${s.startTime}`);
      const sessionEnd = new Date(`${sDate.toDateString()} ${s.endTime}`);

      return selectedStart < sessionEnd && selectedEnd > sessionStart;
    });

    if (isOverlapping) {
      setErrorMessage('This time slot overlaps with an existing session');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    onSave({
      id: sessionData?.id || Date.now(),
      caseNumber: formData.caseNumber,
      datetime: datetime.toString(),
      startTime: formData.startTime,
      endTime: formData.endTime,
      arbitrator: formData.arbitrator,
      claimantEmail: formData.claimantEmail,
      respondentEmail: formData.respondentEmail,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md border border-gray-300">
        <h2 className="text-xl font-bold mb-4" style={{ color: '#005186' }}>
          {sessionData?.id ? (readOnly ? 'Session Details' : 'Update Session') : 'Create Session'}
        </h2>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 px-3 py-2 rounded border border-red-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <label className="block mb-1 text-sm font-medium">Case Number</label>
            <input
              className="w-full border p-2 rounded"
              placeholder="Case Number"
              value={formData.caseNumber}
              onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
              readOnly={readOnly}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              readOnly={readOnly}
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block mb-1 text-sm font-medium">Start Time</label>
              <select
                className="w-full border p-2 rounded"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                disabled={readOnly}
                required
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label className="block mb-1 text-sm font-medium">End Time</label>
              <select
                className="w-full border p-2 rounded"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                disabled={readOnly}
                required
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Arbitrator Email</label>
            <input
              className="w-full border p-2 rounded bg-gray-100 text-gray-600"
              value={formData.arbitrator}
              readOnly
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Claimant Email</label>
            <input
              className="w-full border p-2 rounded"
              placeholder="Claimant Email"
              value={formData.claimantEmail}
              onChange={(e) => setFormData({ ...formData, claimantEmail: e.target.value })}
              readOnly={readOnly}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Respondent Email</label>
            <input
              className="w-full border p-2 rounded"
              placeholder="Respondent Email"
              value={formData.respondentEmail}
              onChange={(e) => setFormData({ ...formData, respondentEmail: e.target.value })}
              readOnly={readOnly}
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded"
              style={{ backgroundColor: '#fbb04c' }}
            >
              {readOnly ? 'Close' : 'Cancel'}
            </button>

            {!readOnly && sessionData?.id && (
              <button
                type="button"
                onClick={() => onDelete(sessionData.id)}
                className="px-4 py-2 rounded text-white"
                style={{ backgroundColor: '#f44336' }}
              >
                Delete
              </button>
            )}

            {!readOnly && (
              <button
                type="submit"
                className="text-white px-4 py-2 rounded"
                style={{ backgroundColor: '#fbb04c' }}
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
