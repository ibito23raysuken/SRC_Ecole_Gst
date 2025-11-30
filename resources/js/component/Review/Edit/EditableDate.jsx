import { useState, useEffect, useContext } from "react";
import { Edit3, Save } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";

export default function EditableDate({ value, student, setStudent }) {
  const { token } = useContext(AppContext);
  const [editing, setEditing] = useState(false);

  // valeur toujours SÛRE 🚀
  const [tempValue, setTempValue] = useState("");

  // met à jour après chargement du backend
  useEffect(() => {
    if (value) {
      setTempValue(value.split("T")[0]);
    }
  }, [value]);

  const handleSave = async () => {
    try {
      await updateStudentApi(student.id, { birth_date: tempValue }, token);

      // mise à jour IMMÉDIATE de l’affichage
      setStudent(prev => ({ ...prev, birthDate: tempValue }));

      setEditing(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500 mb-1">Date de naissance</p>

        {editing ? (
          <input
            type="date"
            value={tempValue}  // 🔥 toujours string => jamais erreur
            onChange={(e) => setTempValue(e.target.value)}
            className="border rounded-md p-1"
          />
        ) : (
          <p className="font-medium text-gray-800">
            {value ? new Date(value).toLocaleDateString("fr-FR") : "Non renseigné"}
          </p>
        )}
      </div>

      <button
        onClick={editing ? handleSave : () => setEditing(true)}
        className={`ml-2 font-bold ${editing ? "text-green-600" : "text-red-600"}`}
      >
        {editing ? <Save /> : <Edit3 />}
      </button>
    </div>
  );
}
