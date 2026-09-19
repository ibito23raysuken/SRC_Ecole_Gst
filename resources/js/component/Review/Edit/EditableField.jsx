import { useState, useContext } from "react";
import { Edit3, Save, X, Trash2 } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";
import { toast } from "react-hot-toast";

export default function EditableField({
  field,
  label,
  value,
  student,
  updateStudentField,
  onDelete,
}) {
  const { token } = useContext(AppContext);
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!student?.id || !field) return;

    if (tempValue === (value || "")) {
      setEditing(false);
      return;
    }

    setLoading(true);

    try {
      const updatedStudent = await updateStudentApi(student.id, {
        [field]: tempValue,
      });

      updateStudentField(updatedStudent, `${label} mis à jour`);
      setEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempValue(value || "");
    setEditing(false);
  };

  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm transition md:flex md:items-center md:justify-between">

      {/* LABEL */}
      <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide md:mb-0 md:w-1/4">
        {label}
      </p>

      {/* CONTENT */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-3 md:w-3/4">

        {/* VALUE / INPUT */}
        {!editing ? (
          <div className="flex-1 text-gray-800 text-sm py-2">
            {value || (
              <span className="text-gray-400 italic">Non renseigné</span>
            )}
          </div>
        ) : (
          <input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            disabled={loading}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            className="
              flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-green-400
              md:w-full
            "
          />
        )}

        {/* ACTIONS */}
        <div className="flex items-center gap-2 mt-3 md:mt-0">

          {/* DELETE */}
          {!editing && onDelete && (
            <button
              onClick={onDelete}
              className="
                p-2 rounded-lg text-gray-400
                hover:text-red-500 hover:bg-red-50
                transition
              "
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          )}

          {/* CANCEL */}
          {editing && (
            <button
              onClick={handleCancel}
              className="
                p-2 rounded-lg text-gray-400
                hover:text-gray-600 hover:bg-gray-100
                transition
              "
              title="Annuler"
            >
              <X size={18} />
            </button>
          )}

          {/* EDIT / SAVE */}
          <button
            onClick={editing ? handleSave : () => setEditing(true)}
            disabled={loading}
            className={`
              flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium
              transition
              ${
                editing
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
              ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {editing ? (
              <>
                <Save size={16} />
                {loading ? "..." : "Sauver"}
              </>
            ) : (
              <>
                <Edit3 size={16} />
                Modifier
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
