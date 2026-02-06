import { useState, useEffect, useContext } from "react";
import { Edit3, Save, X } from "lucide-react";
import { updateStudentApi } from '../../../api/apistudents';
import { AppContext } from "../../../Context/AppContext";

export default function EditableFullName({ student, updateStudentField }) {
  const { token } = useContext(AppContext);

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(student.first_name || "");
  const [lastName, setLastName] = useState(student.last_name || "");
  const [loading, setLoading] = useState(false);

  // Synchronise les champs si le parent change le student
  useEffect(() => {
    setFirstName(student.first_name || "");
    setLastName(student.last_name || "");
  }, [student]);

  const handleSave = async () => {
    if (!student?.id) return;

    // Evite de sauvegarder si rien n'a changé
    if (
      firstName.trim() === student.first_name?.trim() &&
      lastName.trim() === student.last_name?.trim()
    ) {
      setEditing(false);
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        first_name: firstName.trim(),
        last_name: lastName.trim()
      };

      // Appel API
      const savedStudent = await updateStudentApi(student.id, updatedData, token);

      // Met à jour le parent
      updateStudentField(savedStudent);

      setEditing(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      alert("Impossible de sauvegarder !");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFirstName(student.first_name || "");
    setLastName(student.last_name || "");
    setEditing(false);
  };

  return (
    <div className="mb-3">
      {!editing ? (
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-red-600">
            {student.first_name} {student.last_name}
          </h1>
          <button onClick={() => setEditing(true)} className="hover:text-red-800">
            <Edit3 />
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <input
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="border p-2 rounded w-32"
            placeholder="Prénom"
          />
          <input
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="border p-2 rounded w-32"
            placeholder="Nom"
          />
          <button
            onClick={handleSave}
            disabled={loading}
            className={`bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Save className="w-4 h-4" /> {loading ? "Sauvegarde..." : "Sauvegarder"}
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded flex items-center gap-1 hover:bg-gray-400"
          >
            <X className="w-4 h-4" /> Annuler
          </button>
        </div>
      )}
    </div>
  );
}
