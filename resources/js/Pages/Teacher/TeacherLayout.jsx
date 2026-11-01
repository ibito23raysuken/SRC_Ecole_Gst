import { Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Bell } from 'lucide-react';
import { AppContext } from '../../Context/AppContext';
import TeacherSidebar from '../../component/TeacherSidebar';

export default function TeacherLayout() {
  const { user, token, setUser, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  async function logout() {
    await fetch('/api/logout', { method: 'POST', headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }).catch(() => {});
    setUser(null);
    setToken('');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <TeacherSidebar onLogout={logout} />
      <main className="min-h-screen w-full pl-24 pr-4 md:pr-8">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 shadow-sm md:px-8">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-red-600">Espace enseignant</p><h1 className="text-lg font-bold text-gray-800">Bonjour, {user?.firstName}</h1></div>
          <div className="flex items-center gap-3"><button type="button" className="rounded-full p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600" aria-label="Notifications"><Bell size={20} /></button><div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">{user?.firstName?.[0]}{user?.lastName?.[0]}</div></div>
        </header>
        <div className="p-5 md:p-8"><Outlet /></div>
      </main>
    </div>
  );
}
