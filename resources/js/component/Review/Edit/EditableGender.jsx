import { useState, useContext } from "react";
import { Edit3, Save } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";

export default function EditableGender({ value, student, setStudent }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
  const { token } = useContext(AppContext);

  const handleSave = async () => {
    try {
      const response = await updateStudentApi(
        student.id,
        { gender: tempValue }, // clé backend
        token
      );

      if (response.student) {
        setStudent(prev => ({ ...prev, ...response.student }));
      }

      setEditing(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      alert("Erreur lors de la sauvegarde du genre.");
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500 mb-1">Genre</p>

        {editing ? (
          <select
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="border rounded-md p-1"
          >
            <option value="">-- Sélectionner --</option>
            <option value="male">Masculin</option>
            <option value="female">Féminin</option>
          </select>
        ) : (
          <p className="font-medium text-gray-800">
            {value === "male" && "Masculin"}
            {value === "female" && "Féminin"}
            {!value && "Non renseigné"}
          </p>
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
