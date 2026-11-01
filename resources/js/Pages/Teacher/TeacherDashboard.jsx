import { useEffect, useState } from 'react';
import { BookOpen, GraduationCap, MessageSquare, Users } from 'lucide-react';
import { getTeacherDashboardApi } from '../../api/apiTeacherSpace';

const cards = [['classes_count', 'Classes attribuées', GraduationCap], ['students_count', 'Élèves suivis', Users], ['notes_count', 'Notes enregistrées', BookOpen], ['unread_messages', 'Messages non lus', MessageSquare]];

export default function TeacherDashboard() {
  const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { getTeacherDashboardApi().then(setData).catch(() => setError('Impossible de charger le tableau de bord.')); }, []);
  if (error) return <p className="rounded border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>;
  if (!data) return <p className="text-gray-500">Chargement du tableau de bord…</p>;
  return <div className="space-y-8"><div><h2 className="text-3xl font-bold text-gray-800">Tableau de bord</h2><p className="mt-1 text-gray-500">Votre activité pédagogique en un coup d’œil.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([key, label, Icon]) => <div key={key} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><p className="text-sm text-gray-500">{label}</p><Icon className="text-red-600" size={20} /></div><p className="text-3xl font-bold text-gray-800">{data[key] ?? 0}</p></div>)}</div><section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"><h3 className="mb-4 text-lg font-bold text-gray-800">Mes classes</h3><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{data.classes.map((item) => <div key={item.id} className="rounded border border-gray-200 bg-gray-50 p-4"><p className="font-semibold text-gray-800">{item.name}</p><p className="mt-1 text-sm text-gray-500">{item.students_count} élève(s) · {item.level || 'Niveau non renseigné'}</p></div>)}</div></section></div>;
}
