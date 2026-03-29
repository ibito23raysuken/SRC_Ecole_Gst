import { useState } from "react";

export default function NotesPage() {
  const [student, setStudent] = useState({
    name: "",
    class: "",
  });

  const [subjects, setSubjects] = useState([
    { name: "Math", note: "" },
    { name: "Français", note: "" },
    { name: "Anglais", note: "" },
    { name: "SVT", note: "" },
  ]);

  const handleNoteChange = (index, value) => {
    const updated = [...subjects];
    updated[index].note = value;
    setSubjects(updated);
  };

  const average = () => {
    const validNotes = subjects.map((s) => parseFloat(s.note) || 0);
    const sum = validNotes.reduce((a, b) => a + b, 0);
    return (sum / subjects.length).toFixed(2);
  };

  const getMention = () => {
    const avg = parseFloat(average());
    if (avg >= 16) return "Très Bien";
    if (avg >= 14) return "Bien";
    if (avg >= 12) return "Assez Bien";
    if (avg >= 10) return "Passable";
    return "Insuffisant";
  };

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-2xl font-bold">Gestion des Notes</h1>

      {/* Infos élève */}
      <div className="bg-white shadow rounded-2xl p-4 space-y-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Nom de l'élève"
          value={student.name}
          onChange={(e) => setStudent({ ...student, name: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Classe"
          value={student.class}
          onChange={(e) => setStudent({ ...student, class: e.target.value })}
        />
      </div>

      {/* Notes */}
      <div className="bg-white shadow rounded-2xl p-4 space-y-4">
        {subjects.map((subject, index) => (
          <div key={index} className="flex gap-4 items-center">
            <span className="w-32">{subject.name}</span>
            <input
              type="number"
              className="border p-2 rounded w-full"
              placeholder="Note /20"
              value={subject.note}
              onChange={(e) => handleNoteChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Bulletin */}
      <div className="bg-white shadow rounded-2xl p-4 space-y-2">
        <h2 className="text-xl font-semibold">Bulletin</h2>
        <p>
          <strong>Nom:</strong> {student.name}
        </p>
        <p>
          <strong>Classe:</strong> {student.class}
        </p>

        <div className="mt-2">
          {subjects.map((s, i) => (
            <div key={i} className="flex justify-between">
              <span>{s.name}</span>
              <span>{s.note || "-"}/20</span>
            </div>
          ))}
        </div>

        <div className="mt-4 text-lg font-bold">
          Moyenne: {average()}/20
        </div>

        <div className="font-semibold">Mention: {getMention()}</div>

        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
      </div>
    </div>
  );
}
