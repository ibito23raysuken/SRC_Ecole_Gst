import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import Sidebar from "../component/Sidebar";

export default function Layout() {
  const { user, token, setUser, setToken } = useContext(AppContext); const navigate = useNavigate();
  async function handleLogout() { await fetch("/api/logout", { method: "POST", headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }).catch(() => {}); setUser(null); setToken(""); navigate("/login"); }
  if (user?.role?.toLowerCase() === "teacher") return <Outlet />;
  if (user?.role?.toLowerCase() === "admin") return <div className="min-h-screen bg-slate-50"><Sidebar onLogout={handleLogout} /><main className="app-page md:ml-[var(--app-sidebar-width)]"><div className="app-content pt-16 md:pt-6"><Outlet /></div></main></div>;
  return <div className="min-h-screen bg-slate-50"><header className="flex h-[var(--app-header-height)] items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm md:px-8"><Link to="/" className="font-bold text-red-700">École Les Savants</Link><div className="flex items-center gap-3">{user ? <><span className="hidden text-sm text-slate-600 sm:inline">Bonjour, {user.firstName}</span><button type="button" onClick={handleLogout} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700">Déconnexion</button></> : <Link to="/login" className="rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800">Connexion</Link>}</div></header><main className="app-page"><div className="app-content"><Outlet /></div></main></div>;
}
