import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, MessageSquare, Users } from "lucide-react";
import { getTeacherDashboardApi } from "../../api/apiTeacherSpace";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import LoadingState from "../../components/common/LoadingState";

const cards = [["classes_count", "Classes attribuées", GraduationCap, "red"], ["students_count", "Élèves suivis", Users, "slate"], ["notes_count", "Notes enregistrées", BookOpen, "green"], ["unread_messages", "Messages non lus", MessageSquare, "amber"]];

export default function TeacherDashboard() {
  const [data, setData] = useState(null); const [error, setError] = useState("");
  useEffect(() => { getTeacherDashboardApi().then(setData).catch(() => setError("Impossible de charger le tableau de bord.")); }, []);
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>;
  if (!data) return <LoadingState label="Chargement du tableau de bord…" />;
  return <div><PageHeader title="Tableau de bord" subtitle="Votre activité pédagogique en un coup d’œil." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([key, label, Icon, tone]) => <StatCard key={key} label={label} value={data[key] ?? 0} icon={Icon} tone={tone} />)}</div><section className="app-card mt-6 p-6"><h2 className="mb-4 text-lg font-bold text-slate-800">Mes classes</h2><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{data.classes.map((item) => <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="font-semibold text-slate-800">{item.name}</p><p className="mt-1 text-sm text-slate-500">{item.students_count} élève(s) · {item.level || "Niveau non renseigné"}</p></div>)}</div></section></div>;
}
