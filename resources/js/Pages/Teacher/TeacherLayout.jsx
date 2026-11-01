import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Bell, BookOpen, GraduationCap, LayoutDashboard, LogOut, MessageSquare, UserRound, Users } from 'lucide-react';
import { AppContext } from '../../Context/AppContext';

const links = [
  { to: '/teacher', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/teacher/classes', label: 'Mes classes', icon: GraduationCap },
  { to: '/teacher/students', label: 'Mes élèves', icon: Users },
  { to: '/teacher/notes', label: 'Gestion des notes', icon: BookOpen },
  { to: '/teacher/messages', label: 'Messagerie', icon: MessageSquare },
  { to: '/teacher/profile', label: 'Mon profil', icon: UserRound },
];

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
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <aside className="w-full border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="rounded-xl bg-red-700 p-2 text-white"><GraduationCap size={24} /></div>
          <div><p className="font-bold text-slate-900">Espace enseignant</p><p className="text-xs text-slate-500">Gestion scolaire</p></div>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-1 lg:px-4">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex min-w-max items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto hidden border-t border-slate-100 p-4 lg:block">
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700"><LogOut size={18} />Déconnexion</button>
        </div>
      </aside>

      <main className="min-h-screen w-full lg:ml-72">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur md:px-8">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-red-600">Espace enseignant</p><h1 className="text-lg font-bold">Bonjour, {user?.firstName}</h1></div>
          <div className="flex items-center gap-3"><button className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><Bell size={20} /></button><div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">{user?.firstName?.[0]}{user?.lastName?.[0]}</div></div>
        </header>
        <div className="p-5 md:p-8"><Outlet /></div>
      </main>
    </div>
  );
}
