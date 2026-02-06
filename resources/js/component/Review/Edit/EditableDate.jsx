import { useState, useEffect, useContext } from "react";
import { Edit3, Save, X } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";

export default function EditableDate({ value, student, updateStudentField }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AppContext);

  // Synchronisation si la valeur change dans le parent
  useEffect(() => {
    setTempValue(value ? value.split("T")[0] : "");
  }, [value]);

 const handleSave = async () => {
  if (!student?.id) return;

  if (tempValue === value?.split("T")[0]) {
    setEditing(false);
    return;
  }

  setLoading(true);
  try {
    await updateStudentApi(
      student.id,
      { birth_date: tempValue },
      token
    );

    // ✅ mise à jour correcte du parent
    updateStudentField("birth_date", tempValue);

    setEditing(false);
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
    alert("Impossible de sauvegarder la date !");
  } finally {
    setLoading(false);
  }
};


  const handleCancel = () => {
    setTempValue(value ? value.split("T")[0] : "");
    setEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500 mb-1">Date de naissance</p>

        {editing ? (
          <input
            type="date"
            value={tempValue || ""}
            onChange={(e) => setTempValue(e.target.value)}
            className="border rounded-md p-1"
          />
        ) : (
          <p className="font-medium text-gray-800">
            {value ? new Date(value).toLocaleDateString("fr-FR") : "Non renseigné"}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {editing && (
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={editing ? handleSave : () => setEditing(true)}
          disabled={loading}
          className={`font-bold ${editing ? "text-green-600" : "text-red-600"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {editing ? <Save className="w-5 h-5 mr-1 inline" /> : <Edit3 className="w-5 h-5 mr-1 inline" />}
          {editing ? (loading ? "Sauvegarde..." : "") : ""}
        </button>
      </div>
    </div>
  );
}
