'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarView from '@/app/components/CalendarView';
import SessionModal from '@/app/components/SessionModal';
import DeleteConfirmModal from '@/app/components/DeleteConfirmModal';

export default function CalendarPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sessions, setSessions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState('');

useEffect(() => {
  setMounted(true);
  setSelectedDate(new Date());

  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) router.push('/login');

  const storedEmail = localStorage.getItem('currentUser');
  const storedRole = localStorage.getItem('userRole');
  const storedSessions = localStorage.getItem('sessions');

  if (storedEmail) setCurrentUserEmail(storedEmail);
  if (storedRole) setCurrentUserRole(storedRole);
  if (storedSessions) setSessions(JSON.parse(storedSessions));
}, [router]);


useEffect(() => {
  if (mounted) {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }
}, [sessions, mounted]);


  useEffect(() => {
    if (currentUserRole === 'claimant' || currentUserRole === 'respondent') {
      setViewType('month');
    }
  }, [currentUserRole]);

  if (!mounted || !selectedDate) return null;

  const handleSlotClick = (datetime: Date) => {
    if (currentUserRole === 'claimant' || currentUserRole === 'respondent') return;

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
    setDeleteConfirmId(null);
    setEditingSession(null);
    setModalOpen(false);
  };

  const handleSaveSession = (session) => {
    setSessions((prev) => {
      const exists = prev.find((s) => s.id === session.id);
      if (exists) {
        return prev.map((s) => (s.id === session.id ? session : s));
      }
      return [...prev, session];
    });
    setModalOpen(false);
    setEditingSession(null);
  };

  const visibleSessions = sessions.filter((s) => {
    if (currentUserRole === 'claimant') return s.claimantEmail === currentUserEmail;
    if (currentUserRole === 'respondent') return s.respondentEmail === currentUserEmail;
    return true;
  });

  return (
    <>
      <header className="w-full bg-white px-4 py-6 border-b flex items-center justify-between">
        <img
          src="https://presolv360.com/build/static/media/logo.1326f5cba41d9c4e5917.png"
          alt="Presolv360 Logo"
          className="h-8 object-contain"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[#005186] font-medium">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
              👤
            </div>
            {currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1)}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('userRole');
              window.location.href = '/login';
            }}
            className="text-red-600 hover:text-red-800 text-xl"
            title="Logout"
          >
            ⏻
          </button>
        </div>
      </header>

      <main className="min-h-screen bg-white text-black flex">
        {sidebarOpen && (
          <aside className="w-64 bg-gray-100 p-4 shadow-md">
            <h2 className="text-xl font-bold mb-6">📅 Calendar</h2>
          </aside>
        )}

        <div className="flex-1 p-4 relative">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl absolute top-4 left-4 lg:hidden"
          >
            ☰
          </button>

          <CalendarView
            viewType={viewType}
            selectedDate={selectedDate}
            sessions={visibleSessions}
            onSlotClick={handleSlotClick}
            onEdit={handleEditSession}
            onChangeView={setViewType}
          />

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
            sessions={sessions}
            readOnly={currentUserRole === 'claimant' || currentUserRole === 'respondent'}
          />

          <DeleteConfirmModal
            isOpen={!!deleteConfirmId}
            onClose={() => setDeleteConfirmId(null)}
            onConfirm={confirmDelete}
          />
        </div>
      </main>
    </>
  );
}
