import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  House,
  List,
  LogOut,
  UserCircle,
  Users,
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', title: 'Tableau de bord', icon: <House size={22} />, path: '/teacher' },
  { id: 'classes', title: 'Mes classes', icon: <GraduationCap size={22} />, subMenus: [{ title: 'Liste de mes classes', path: '/teacher/classes' }] },
  { id: 'students', title: 'Mes élèves', icon: <Users size={22} />, subMenus: [{ title: 'Liste de mes élèves', path: '/teacher/students' }] },
  { id: 'notes', title: 'Gestion des notes', icon: <BookOpen size={22} />, subMenus: [{ title: 'Saisie et consultation', path: '/teacher/notes' }] },
  { id: 'messages', title: 'Messages', icon: <Users size={22} />, subMenus: [{ title: "Messages avec l'administration", path: '/teacher/messages' }] },
  { id: 'profile', title: 'Mon profil', icon: <UserCircle size={22} />, path: '/teacher/profile' },
];

function itemIsActive(item, pathname) {
  return item.path
    ? item.id === 'dashboard' ? pathname === item.path : pathname === item.path || pathname.startsWith(`${item.path}/`)
    : item.subMenus?.some((subMenu) => pathname === subMenu.path || pathname.startsWith(`${subMenu.path}/`));
}

export default function TeacherSidebar({ onLogout }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const activeItem = useMemo(() => menuItems.find((item) => itemIsActive(item, location.pathname))?.id ?? null, [location.pathname]);
  const [activeMenu, setActiveMenu] = useState(activeItem);

  useEffect(() => {
    if (activeItem) setActiveMenu(activeItem);
  }, [activeItem]);

  return (
    <aside
      className={`fixed left-4 top-20 z-40 mt-4 flex max-h-[90vh] flex-col justify-between overflow-y-auto rounded-2xl bg-gradient-to-b from-red-700 to-red-800 shadow-xl transition-all duration-300 ease-in-out ${open ? 'w-60' : 'w-16'} hover:w-60`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      aria-label="Navigation enseignant"
    >
      <div className="space-y-1 p-4">
        <div className={`mb-3 flex items-center gap-3 border-b border-red-500/60 pb-4 text-white ${open ? 'justify-start' : 'justify-center'}`}>
          <GraduationCap size={24} />
          {open && <div><p className="font-bold">ERP Scolaire</p><p className="text-xs text-red-100">Espace enseignant</p></div>}
        </div>
        <button type="button" onClick={() => setOpen((isOpen) => !isOpen)} className="mb-2 flex w-full items-center justify-center rounded-lg px-3 py-3 text-white transition hover:bg-red-600 md:hidden" aria-label={open ? 'Réduire le menu' : 'Ouvrir le menu'}>
          <List size={22} />
        </button>
        {menuItems.map((item) => {
          const isActive = itemIsActive(item, location.pathname);
          return (
            <div key={item.id} className="mb-1">
              {item.subMenus ? (
                <>
                  <button type="button" onClick={() => { setOpen(true); setActiveMenu(activeMenu === item.id ? null : item.id); }} className={`flex w-full items-center gap-4 rounded-lg px-3 py-3 text-white transition ${open ? 'justify-between' : 'justify-center'} ${isActive ? 'bg-red-600' : 'hover:bg-red-600'}`} title={!open ? item.title : undefined}>
                    <span className="flex items-center gap-4">{item.icon}{open && <span className="font-medium">{item.title}</span>}</span>
                    {open && (activeMenu === item.id ? <ChevronDown size={17} /> : <ChevronRight size={17} />)}
                  </button>
                  {open && activeMenu === item.id && <div className="ml-8 mt-1 space-y-1 border-l-2 border-red-500 pl-2">{item.subMenus.map((subMenu) => <Link key={subMenu.path} to={subMenu.path} className={`block rounded-lg px-3 py-2 text-sm text-white transition ${location.pathname === subMenu.path ? 'bg-red-600' : 'hover:bg-red-600'}`}>{subMenu.title}</Link>)}</div>}
                </>
              ) : (
                <Link to={item.path} className={`flex w-full items-center gap-4 rounded-lg px-3 py-3 text-white transition ${open ? 'justify-start' : 'justify-center'} ${isActive ? 'bg-red-600' : 'hover:bg-red-600'}`} title={!open ? item.title : undefined}>{item.icon}{open && <span className="font-medium">{item.title}</span>}</Link>
              )}
            </div>
          );
        })}
        <button type="button" onClick={onLogout} className={`flex w-full items-center gap-4 rounded-lg px-3 py-3 text-white transition hover:bg-red-600 ${open ? 'justify-start' : 'justify-center'}`} title={!open ? 'Déconnexion' : undefined}>
          <LogOut size={22} />{open && <span className="font-medium">Déconnexion</span>}
        </button>
      </div>
      <div className="p-4 text-center text-xs text-white opacity-70">{open && '© 2026 ERP Scolaire'}</div>
    </aside>
  );
}
