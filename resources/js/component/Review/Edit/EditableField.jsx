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
      const updateData = { [field]: tempValue };
      const updatedStudent = await updateStudentApi(student.id, updateData);

      updateStudentField(updatedStudent, `${label} mis à jour ✅`);
      setEditing(false);
    } catch (error) {
      console.error(error);
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat().join(", ");
        toast.error(errorMessages || "Erreur lors de la sauvegarde");
      } else {
        toast.error("Erreur lors de la sauvegarde");
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
    <div className="border border-gray-200 rounded-xl p-4 bg-white">

      {/* LABEL */}
      <p className="text-sm text-gray-500 mb-2">{label}</p>

      {/* ROW */}
      <div className="flex items-stretch gap-2 w-full">

        {/* VIEW / INPUT */}
        {!editing ? (
          <div className="flex-1 min-w-0 h-11 px-3 rounded-lg flex items-center text-gray-800 bg-gray-50">
            {value || "Non renseigné"}
          </div>
        ) : (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            className="
              flex-1 min-w-0 h-11 px-3 border rounded-lg text-base
              focus:ring-2 focus:ring-blue-500 outline-none
            "
            autoFocus
          />
        )}

        {/* ACTIONS */}
        <div className="flex gap-2 shrink-0">

          {/* DELETE */}
          {!editing && onDelete && (
            <button
              onClick={onDelete}
              className="
                group flex items-center h-11 px-3 rounded-lg
                bg-gray-100 hover:bg-red-50
                transition-all duration-300 shrink-0
              "
            >
              <Trash2 className="w-5 h-5 text-gray-600 group-hover:text-red-600" />

              <span className="
                ml-2 overflow-hidden max-w-0 opacity-0
                group-hover:max-w-[100px] group-hover:opacity-100
                transition-all duration-300 text-red-600 text-sm whitespace-nowrap
              ">
                Supprimer
              </span>
            </button>
          )}

          {/* CANCEL */}
          {editing && (
            <button
              onClick={handleCancel}
              disabled={loading}
              className="
                group flex items-center h-11 px-3 rounded-lg
                bg-gray-100 hover:bg-gray-200
                transition-all duration-300 shrink-0
              "
            >
              <X className="w-5 h-5 text-gray-600" />
              <span className="
                ml-0 overflow-hidden max-w-0 group-hover:max-w-[100px] opacity-0 group-hover:opacity-100
                transition-all duration-300 text-gray-600 text-sm whitespace-nowrap
              ">
                Annuler
              </span>
            </button>
          )}

          {/* EDIT/SAVE */}
          <button
            onClick={editing ? handleSave : () => setEditing(true)}
            disabled={loading}
            className={`
              group flex items-center h-11 px-3 rounded-lg
              transition-all duration-300 shrink-0
              ${editing
                ? "bg-green-50 hover:bg-green-100"
                : "bg-gray-100 hover:bg-orange-50"
              }
              ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {editing ? (
              <>
                <Save className="w-5 h-5 text-green-600" />
                <span className="
                  ml-0 overflow-hidden max-w-0 group-hover:max-w-[120px] opacity-0 group-hover:opacity-100
                  transition-all duration-300 text-green-600 text-sm whitespace-nowrap
                ">
                  {loading ? "..." : "Enregistrer"}
                </span>
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                <span className="
                  ml-0 overflow-hidden max-w-0 group-hover:max-w-[100px] opacity-0 group-hover:opacity-100
                  transition-all duration-300 text-orange-600 text-sm whitespace-nowrap
                ">
                  Modifier
                </span>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
