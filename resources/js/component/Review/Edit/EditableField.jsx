import { useState, useEffect, useContext } from "react";
import { Edit3, Save } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";

export default function EditableField({ field, label, value, student, updateStudentField }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
  const { token } = useContext(AppContext);

  useEffect(() => {
    setTempValue(value || "");
  }, [value]);

  const handleSave = async () => {
    if (!student?.id) return;

    if (tempValue === (value || "")) {
      setEditing(false);
      return;
    }

    try {
      // Appel API
      await updateStudentApi(student.id, { [field]: tempValue }, token);

      // Mise à jour du parent
      updateStudentField(field, tempValue);

      setEditing(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      alert("Impossible de sauvegarder la valeur !");
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">{label}</p>

        {editing ? (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="border rounded-md p-1 w-full"
            autoFocus
          />
        ) : (
          <p className="font-medium text-gray-800">{value || "Non renseigné"}</p>
        )}
      </div>

      <button
        onClick={editing ? handleSave : () => setEditing(true)}
        className={`ml-2 font-bold ${editing ? "text-green-600" : "text-red-600"}`}
      >
        {editing ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
      </button>
    </div>
  );
}
