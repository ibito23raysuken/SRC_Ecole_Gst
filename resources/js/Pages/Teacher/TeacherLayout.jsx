import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Bell } from "lucide-react";
import { AppContext } from "../../Context/AppContext";
import TeacherSidebar from "../../component/TeacherSidebar";

export default function TeacherLayout() {
  const { user, token, setUser, setToken } = useContext(AppContext); const navigate = useNavigate();
  async function logout() { await fetch("/api/logout", { method: "POST", headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }).catch(() => {}); setUser(null); setToken(""); navigate("/login"); }
  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`;
  return <div className="min-h-screen bg-slate-50 text-slate-800"><TeacherSidebar onLogout={logout} /><main className="md:ml-[var(--app-sidebar-width)]"><header className="sticky top-0 z-30 flex h-[var(--app-header-height)] items-center justify-between border-b border-slate-200 bg-white px-5 pl-16 shadow-sm md:px-8"><div><p className="text-xs font-semibold uppercase tracking-wider text-red-600">Espace enseignant</p><h1 className="text-base font-bold text-slate-800">Bonjour, {user?.first_name}</h1></div><div className="flex items-center gap-3"><button type="button" className="rounded-full p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600" aria-label="Notifications"><Bell size={20} /></button><div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">{initials}</div></div></header><div className="app-content pt-6"><Outlet /></div></main></div>;
}
