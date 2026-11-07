import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, ChevronRight, GraduationCap, Home, LogOut, Menu, MessageSquare, UserCircle, Users, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { id: "dashboard", title: "Tableau de bord", icon: Home, path: "/teacher" },
  { id: "classes", title: "Mes classes", icon: GraduationCap, subMenus: [{ title: "Liste de mes classes", path: "/teacher/classes" }] },
  { id: "students", title: "Mes élèves", icon: Users, subMenus: [{ title: "Liste de mes élèves", path: "/teacher/students" }] },
  { id: "notes", title: "Gestion des notes", icon: BookOpen, subMenus: [{ title: "Saisie et consultation", path: "/teacher/notes" }] },
  { id: "messages", title: "Messages", icon: MessageSquare, subMenus: [{ title: "Avec l'administration", path: "/teacher/messages" }] },
  { id: "profile", title: "Mon profil", icon: UserCircle, path: "/teacher/profile" },
];

function isActive(item, pathname) { return item.path ? pathname === item.path || pathname.startsWith(`${item.path}/`) : item.subMenus?.some((sub) => pathname === sub.path || pathname.startsWith(`${sub.path}/`)); }

export default function TeacherSidebar({ onLogout }) {
  const location = useLocation(); const [open, setOpen] = useState(false); const [activeMenu, setActiveMenu] = useState(null);
  useEffect(() => { const current = menuItems.find((item) => isActive(item, location.pathname)); if (current?.subMenus) setActiveMenu(current.id); setOpen(false); }, [location.pathname]);
  const closeMobile = () => { if (window.innerWidth < 768) setOpen(false); };
  return <>
    <button type="button" onClick={() => setOpen(true)} className="fixed left-4 top-4 z-50 rounded-lg bg-red-700 p-2 text-white shadow-md md:hidden" aria-label="Ouvrir le menu"><Menu size={20} /></button>
    {open && <button type="button" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-slate-950/40 md:hidden" aria-label="Fermer le menu" />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[var(--app-sidebar-width)] flex-col bg-gradient-to-b from-red-800 to-red-950 text-white shadow-xl transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`} aria-label="Navigation enseignant">
      <div className="flex h-[var(--app-header-height)] items-center justify-between border-b border-red-700/70 px-5"><div><p className="font-bold">École Les Savants</p><p className="text-xs text-red-200">Espace enseignant</p></div><button type="button" onClick={() => setOpen(false)} className="rounded-md p-1 hover:bg-red-700 md:hidden" aria-label="Fermer le menu"><X size={20} /></button></div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">{menuItems.map((item) => { const Icon = item.icon; const active = isActive(item, location.pathname); return <div key={item.id}>{item.subMenus ? <><button type="button" onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? "bg-red-700" : "hover:bg-red-700"}`}><span className="flex items-center gap-3"><Icon size={20} />{item.title}</span>{activeMenu === item.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</button>{activeMenu === item.id && <div className="ml-5 mt-1 space-y-1 border-l border-red-500 pl-3">{item.subMenus.map((sub) => <Link key={sub.path} to={sub.path} onClick={closeMobile} className={`block rounded-md px-3 py-2 text-sm transition ${location.pathname === sub.path ? "bg-red-700 text-white" : "text-red-100 hover:bg-red-700"}`}>{sub.title}</Link>)}</div>}</> : <Link to={item.path} onClick={closeMobile} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? "bg-red-700" : "hover:bg-red-700"}`}><Icon size={20} />{item.title}</Link>}</div>; })}</nav>
      <div className="border-t border-red-700/70 p-3"><button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition hover:bg-red-700"><LogOut size={20} />Déconnexion</button><p className="px-2 pt-3 text-xs text-red-200">© {new Date().getFullYear()} ERP scolaire</p></div>
    </aside>
  </>;
}
