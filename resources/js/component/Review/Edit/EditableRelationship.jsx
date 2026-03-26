import { useState, useEffect, useContext } from "react";
import { Edit3, Save, X } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";
import { toast } from "react-hot-toast";

// options
const RELATIONSHIPS = [
  { value: "father", label: "Père" },
  { value: "mother", label: "Mère" },
  { value: "guardian", label: "Tuteur" },
  { value: "other", label: "Autre" }
];

export default function EditableRelationship({
  value,
  student,
  updateStudentField
}) {
  const { token } = useContext(AppContext);

  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(false);

  // sync
  useEffect(() => {
    setTempValue(value || "");
  }, [value]);

  // label affiché
  const getLabel = (val) => {
    const found = RELATIONSHIPS.find(r => r.value === val);
    return found ? found.label : "Non renseigné";
  };

  // SAVE
  const handleSave = async () => {
    if (!student?.id) return;

    if (tempValue === value) {
      setEditing(false);
      return;
    }

    setLoading(true);

    try {
      const res = await updateStudentApi(
        student.id,
        { relationship: tempValue },
        token
      );

      updateStudentField(res.student, "Relation mise à jour ✅");

      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour ❌");
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
        <p className="text-sm text-gray-500 mb-1">Lien de parenté</p>

        {editing ? (
          <select
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            disabled={loading}
            className="border rounded-md p-1"
          >
            <option value="">Sélectionnez</option>
            {RELATIONSHIPS.map(r => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        ) : (
          <p className="font-medium text-gray-800">
            {getLabel(value)}
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
