'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarView from '@/app/components/CalendarView';
import SessionModal from '@/app/components/SessionModal';
import DeleteConfirmModal from '@/app/components/DeleteConfirmModal';

export default function CalendarPage() {
  const router = useRouter();
  const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const currentUserEmail = typeof window !== 'undefined'
    ? localStorage.getItem('currentUser') || 'admin@demo.com'
    : 'admin@demo.com';

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) router.push('/login');
  }, [router]);

  const handleSlotClick = (datetime: Date) => {
    setEditingSession({
      datetime: datetime.toString(),
      arbitrator: currentUserEmail,
    });
    setModalOpen(true);
  };

  const handleEditSession = (sessionId: number) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setEditingSession(session);
      setModalOpen(true);
    }
  };

  const handleDeleteSession = (sessionId: number) => {
    setDeleteConfirmId(sessionId);
  };

  const confirmDelete = () => {
  setSessions((prev) => prev.filter((s) => s.id !== deleteConfirmId));
  setDeleteConfirmId(null);         // ✅ Close confirmation popup
  setEditingSession(null);          // ✅ Clear form data
  setModalOpen(false);              // ✅ Close form modal
};


  const handleSaveSession = (session) => {
    setSessions((prev) => {
      const exists = prev.find((s) => s.id === session.id);
      if (exists) {
        return prev.map((s) => (s.id === session.id ? session : s));
      }
      return [...prev, session];
    });
  };

  return (
    <main className="min-h-screen bg-white text-black flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 bg-gray-100 p-4 shadow-md">
          <h2 className="text-xl font-bold mb-6">📅 Menu</h2>
          <ul className="space-y-3">
            <li>
              <button onClick={() => setViewType('day')} className="w-full text-left">
                Day View
              </button>
            </li>
            <li>
              <button onClick={() => setViewType('week')} className="w-full text-left">
                Week View
              </button>
            </li>
            <li>
              <button onClick={() => setViewType('month')} className="w-full text-left">
                Month View
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem('isLoggedIn');
                  router.push('/login');
                }}
                className="w-full text-left text-red-600"
              >
                Logout
              </button>
            </li>
          </ul>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 relative">
        {/* Burger Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-2xl absolute top-4 left-4 lg:hidden"
        >
          ☰
        </button>

        {/* Calendar View */}
        <CalendarView
          viewType={viewType}
          selectedDate={selectedDate}
          sessions={sessions}
          onSlotClick={handleSlotClick}
          onEdit={handleEditSession}
        />

        {/* Create/Update Modal */}
        <SessionModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingSession(null);
          }}
          onSave={handleSaveSession}
          onDelete={handleDeleteSession}
          sessionData={editingSession}
          currentUser={currentUserEmail}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        />
      </div>
    </main>
  );
}
