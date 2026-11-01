import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Calendar, CheckCircle2, Save, Users } from 'lucide-react';
import { getTeacherClassesApi, getTeacherNotesApi, saveTeacherNoteApi } from '../../api/apiTeacherSpace';

export default function TeacherNotes() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [rows, setRows] = useState([]);
  const [period, setPeriod] = useState('T1');
  const [subjectId, setSubjectId] = useState('');
  const [message, setMessage] = useState('');
  const currentClass = classes.find((item) => String(item.id) === String(selectedClass));

  useEffect(() => {
    getTeacherClassesApi().then((data) => {
      setClasses(data);
      if (data[0]) {
        setSelectedClass(String(data[0].id));
        if (data[0].subjects?.[0]) setSubjectId(String(data[0].subjects[0].id));
      }
    }).catch(() => setClasses([]));
  }, []);

  useEffect(() => {
    if (!selectedClass || !subjectId) return;
    getTeacherNotesApi({ class_id: selectedClass, subject_id: subjectId, period, academic_year_id: currentClass?.academic_year_id }).then(setRows).catch(() => setRows([]));
  }, [selectedClass, subjectId, period, currentClass?.academic_year_id]);
  const average = useMemo(() => {
    const scores = rows.map((row) => Number(row.note?.score)).filter((score) => Number.isFinite(score));
    return scores.length ? (scores.reduce((total, score) => total + score, 0) / scores.length).toFixed(2) : '—';
  }, [rows]);

  const updateRow = (id, field, value) => setRows((current) => current.map((row) => row.student.id === id ? { ...row, note: { ...(row.note || {}), [field]: value } } : row));

  async function save(row) {
    try {
      await saveTeacherNoteApi({ student_id: row.student.id, class_id: selectedClass, subject_id: subjectId, period, academic_year_id: currentClass?.academic_year_id, score: row.note?.score, appreciation: row.note?.appreciation });
      setMessage('Note enregistrée avec succès.');
    } catch {
      setMessage('Cette note ne peut pas être enregistrée.');
    }
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-3xl font-bold text-gray-800">Gestion des notes</h2><p className="mt-1 text-gray-500">Saisissez les notes uniquement pour vos classes et vos matières attribuées.</p></div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section className="space-y-5 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Classe<select value={selectedClass} onChange={(event) => { setSelectedClass(event.target.value); setSubjectId(''); }} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"><option value="">Choisir une classe</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Matière<select value={subjectId} onChange={(event) => setSubjectId(event.target.value)} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"><option value="">Choisir une matière</option>{(currentClass?.subjects || []).map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Période<select value={period} onChange={(event) => setPeriod(event.target.value)} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"><option value="T1">1er trimestre</option><option value="T2">2e trimestre</option><option value="T3">3e trimestre</option></select></label>
          </div>
          {message && <p className="flex items-center gap-2 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700"><CheckCircle2 size={17} />{message}</p>}
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-left text-sm"><thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-500"><tr><th className="p-3">Élève</th><th className="p-3">Note / 20</th><th className="p-3">Moyenne</th><th className="p-3">Appréciation</th><th className="p-3" /></tr></thead><tbody className="divide-y divide-gray-100">{rows.map((row) => <tr key={row.student.id} className="hover:bg-red-50/40"><td className="p-3 font-medium text-gray-800">{row.student.first_name} {row.student.last_name}</td><td className="p-3"><input type="number" min="0" max="20" value={row.note?.score ?? ''} onChange={(event) => updateRow(row.student.id, 'score', event.target.value)} className="w-24 rounded border border-gray-300 p-2 outline-none focus:border-red-600" /></td><td className="p-3 font-semibold text-red-600">{row.average ?? '—'}</td><td className="p-3"><input value={row.note?.appreciation ?? ''} onChange={(event) => updateRow(row.student.id, 'appreciation', event.target.value)} className="w-full min-w-48 rounded border border-gray-300 p-2 outline-none focus:border-red-600" /></td><td className="p-3"><button type="button" onClick={() => save(row)} className="rounded bg-red-600 p-2 text-white transition hover:bg-red-700" aria-label="Enregistrer la note"><Save size={17} /></button></td></tr>)}</tbody></table>
            {!rows.length && <p className="p-6 text-center text-sm text-gray-500">Sélectionnez une classe et une matière pour afficher les élèves.</p>}
          </div>
        </section>
        <aside className="h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><h3 className="flex items-center gap-2 border-b border-gray-200 pb-3 font-semibold text-gray-800"><BookOpen size={18} className="text-red-600" />Aperçu</h3><div className="mt-5 space-y-4 text-sm"><p className="flex items-center gap-2 text-gray-600"><Users size={17} className="text-red-600" />{rows.length} élève(s)</p><p className="flex items-center gap-2 text-gray-600"><Calendar size={17} className="text-red-600" />{period}</p><div className="border-t border-gray-200 pt-4"><p className="text-xs uppercase tracking-wider text-gray-500">Moyenne de la classe</p><p className="mt-1 text-4xl font-light text-red-600">{average}<span className="text-base text-gray-400"> /20</span></p></div></div></aside>
      </div>
    </div>
  );
}
