import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

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
    const validNotes = subjects.map(s => parseFloat(s.note) || 0);
    const sum = validNotes.reduce((a, b) => a + b, 0);
    return (sum / subjects.length).toFixed(2);
  };

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-2xl font-bold">Gestion des Notes</h1>

      <Card className="p-4">
        <CardContent className="grid gap-4">
          <Input
            placeholder="Nom de l'élève"
            value={student.name}
            onChange={(e) => setStudent({ ...student, name: e.target.value })}
          />
          <Input
            placeholder="Classe"
            value={student.class}
            onChange={(e) => setStudent({ ...student, class: e.target.value })}
          />
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardContent className="grid gap-4">
          {subjects.map((subject, index) => (
            <div key={index} className="flex gap-4 items-center">
              <span className="w-32">{subject.name}</span>
              <Input
                type="number"
                placeholder="Note /20"
                value={subject.note}
                onChange={(e) => handleNoteChange(index, e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-4">
          <CardContent className="grid gap-2">
            <h2 className="text-xl font-semibold">Bulletin</h2>
            <p><strong>Nom:</strong> {student.name}</p>
            <p><strong>Classe:</strong> {student.class}</p>

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

            <Button className="mt-4">Enregistrer</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
