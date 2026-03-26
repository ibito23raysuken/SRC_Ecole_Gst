import { useState, useEffect, useContext } from "react";
import { Edit3, Save, X } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";
import { toast } from "react-hot-toast";

export default function EditableDate({ value, student, updateStudentField }) {
  const { token } = useContext(AppContext);

  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Synchronisation
  useEffect(() => {
    if (value) {
      const formatted = value.split("T")[0];
      setTempValue(formatted);
    } else {
      setTempValue("");
    }
  }, [value]);

  // ✅ Format affichage sécurisé
  const formatDisplayDate = (date) => {
    if (!date) return "Non renseigné";

    const d = new Date(date);
    if (isNaN(d)) return "Non renseigné";

    return d.toLocaleDateString("fr-FR");
  };

  // ✅ SAVE
  const handleSave = async () => {
    if (!student?.id) return;

    const original = value ? value.split("T")[0] : "";

    if (tempValue === original) {
      setEditing(false);
      return;
    }

    setLoading(true);

    try {
      const updatedStudent = await updateStudentApi(
        student.id,
        { birth_date: tempValue },
        token
      );

    updateStudentField(updatedStudent.student, "Date de naissance mise à jour ✅");
      setEditing(false);

    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CANCEL
  const handleCancel = () => {
    setTempValue(value ? value.split("T")[0] : "");
    setEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">

      {/* LEFT */}
      <div>
        <p className="text-sm text-gray-500 mb-1">Date de naissance</p>

        {editing ? (
          <input
            type="date"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            disabled={loading}
            className="border rounded-md p-1 disabled:opacity-50"
          />
        ) : (
          <p className="font-medium text-gray-800">
            {formatDisplayDate(value)}
          </p>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {editing && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={editing ? handleSave : () => setEditing(true)}
          disabled={loading}
          className={`font-bold flex items-center ${
            editing ? "text-green-600" : "text-red-600"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {editing ? (
            <>
              <Save className="w-5 h-5 mr-1" />
              {loading && "Sauvegarde..."}
            </>
          ) : (
            <Edit3 className="w-5 h-5" />
          )}
        </button>

      </div>
    </div>
  );
}
