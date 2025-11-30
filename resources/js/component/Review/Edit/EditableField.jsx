import { useState, useContext, useEffect } from "react";
import { Edit3, Save } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";

export default function EditableField({
  cle,
  label,
  value,
  student,
  setStudent, // ⚠️ Ajouter setStudent pour mettre à jour le parent
  type = "text",
  options = [],
}) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const { token } = useContext(AppContext);

  // Mettre à jour tempValue si la prop value change depuis le parent
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = async () => {
    try {
      // Transforme le label en nom de champ ex: "Lieu de naissance" => "birth_place"
      const fieldName = cle
        .toLowerCase()
        .replace(/\s+/g, "_");

      const response = await updateStudentApi(
        student.id,
        { [fieldName]: tempValue }, // clé dynamique
        token
      );

      // ⚡ Mettre à jour le state parent
      if (response.student && setStudent) {
        setStudent((prev) => ({
          ...prev,
          ...response.student,
        }));
      }

      setEditing(false);
    } catch (e) {
      console.error("Erreur update:", e);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>

        {editing ?
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="border rounded-md p-1"
            />
        : (
          <p className="font-medium text-gray-800">{value || "Non renseigné"}</p>
        )}
      </div>

      <button
        onClick={editing ? handleSave : () => setEditing(true)}
        className={`ml-2 font-bold ${editing ? "text-green-600" : "text-red-600"}`}
      >
        {editing ? <Save className="w-5 h-5 mr-2" /> : <Edit3 className="w-5 h-5 mr-2" />}
      </button>
    </div>
  );
}
