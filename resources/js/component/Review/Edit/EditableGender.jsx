import { useState, useEffect, useContext } from "react";
import { Edit3, Save, X } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";
import { toast } from "react-hot-toast";

export default function EditableGender({ value, student, updateStudentField }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AppContext);

  useEffect(() => {
    setTempValue(value || "");
  }, [value]);

  const handleSave = async () => {
    if (!student?.id) return;

    // 🚫 pas de modification
    if (tempValue === (value || "")) {
      setEditing(false);
      return;
    }

    setLoading(true);

    try {
      const res = await updateStudentApi(
        student.id,
        { gender: tempValue }
      );

      // ✅ IMPORTANT : utiliser la réponse backend
      updateStudentField(res, "Genre mis à jour ✅");

      setEditing(false);

    } catch (err) {
      console.error(err);
      if (err.errors) {
        const errorMessages = Object.values(err.errors).flat().join(", ");
        toast.error(errorMessages || "Erreur lors de la mise à jour ❌");
      } else {
        toast.error("Erreur lors de la mise à jour ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempValue(value || "");
    setEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">

      {/* LEFT */}
      <div>
        <p className="text-sm text-gray-500 mb-1">Genre</p>

        {editing ? (
          <select
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            disabled={loading}
            className="border rounded-md p-1 disabled:opacity-50"
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

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {editing && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={editing ? handleSave : () => setEditing(true)}
          disabled={loading}
          className={`font-bold ${
            editing ? "text-green-600" : "text-red-600"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {editing ? (
            <>
              <Save className="w-5 h-5" />
              {loading && " ..."}
            </>
          ) : (
            <Edit3 className="w-5 h-5" />
          )}
        </button>

      </div>
    </div>
  );
}
