import { useEffect, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { getTeacherStudentsApi } from '../../api/apiTeacherSpace';

export default function TeacherStudents() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState(null);
  useEffect(() => { const timer = setTimeout(() => getTeacherStudentsApi({ search }).then((data) => setStudents(data.data || [])).catch(() => setStudents([])), 250); return () => clearTimeout(timer); }, [search]);
  return <div className="space-y-6"><div><h2 className="text-3xl font-bold">Mes élèves</h2><p className="mt-1 text-slate-500">La liste est filtrée par vos classes autorisées.</p></div><div className="relative max-w-md"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un élève…" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 outline-none focus:border-red-500" /></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{!students ? <p className="p-6 text-slate-500">Chargement…</p> : students.length === 0 ? <p className="p-6 text-slate-500">Aucun élève trouvé.</p> : <div className="divide-y divide-slate-100">{students.map((student) => <div key={student.id} className="flex items-center justify-between p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">{student.first_name?.[0]}{student.last_name?.[0]}</div><div><p className="font-semibold">{student.first_name} {student.last_name}</p><p className="text-sm text-slate-500">{student.school_class?.name || 'Classe non renseignée'}</p></div></div><Users size={18} className="text-slate-400" /></div>)}</div>}</div></div>;
}
