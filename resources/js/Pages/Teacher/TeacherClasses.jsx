import { useEffect, useState } from 'react';
import { GraduationCap, Users } from 'lucide-react';
import { getTeacherClassesApi } from '../../api/apiTeacherSpace';

export default function TeacherClasses() {
  const [classes, setClasses] = useState(null);
  useEffect(() => { getTeacherClassesApi().then(setClasses); }, []);
  if (!classes) return <p className="text-slate-500">Chargement des classes…</p>;
  return <div className="space-y-6"><div><h2 className="text-3xl font-bold">Mes classes</h2><p className="mt-1 text-slate-500">Uniquement les classes qui vous sont attribuées.</p></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{classes.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700"><GraduationCap /></div><h3 className="text-xl font-bold">{item.name}</h3><p className="mt-1 text-sm text-slate-500">{item.level || 'Niveau non renseigné'}</p><div className="mt-5 flex items-center gap-2 text-sm text-slate-600"><Users size={17} />{item.students_count} élève(s)</div></article>)}</div></div>;
}
