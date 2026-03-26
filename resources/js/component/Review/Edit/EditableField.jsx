import { useState } from "react";
import { Edit3, Save, X, Trash2 } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../../../component/toast";

export default function EditableField({
  label,
  value,
  onChange,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      await onChange(tempValue);

      showSuccessToast(`${label} mis à jour`);

      setEditing(false);
    } catch (error) {
      showErrorToast("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempValue(value || "");
    setEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4">

      {/* LABEL */}
      <p className="text-sm text-gray-500 mb-2">{label}</p>

      {/* LIGNE */}
      <div className="flex items-stretch gap-2">

        {/* VIEW */}
        {!editing ? (
          <div className="flex-1 h-11 px-3  rounded-lg flex items-center  text-gray-800">
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
            className="flex-1 h-11 px-3 border rounded-lg text-base focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        )}

        {/* ACTIONS */}
        <div className="flex gap-2">

          {/* DELETE */}
          {!editing && onDelete && (
            <button
              onClick={onDelete}
              className="group flex items-center h-11 px-3 rounded-lg bg-gray-100 hover:bg-red-50 transition-all duration-300"
            >
              <Trash2 className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
              <span className="ml-0 overflow-hidden max-w-0 group-hover:max-w-[100px] opacity-0 group-hover:opacity-100 transition-all duration-300 text-red-600 text-sm whitespace-nowrap">
                Supprimer
              </span>
            </button>
          )}

          {/* CANCEL */}
          {editing && (
            <button
              onClick={handleCancel}
              disabled={loading}
              className="group flex items-center h-11 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300"
            >
              <X className="w-5 h-5 text-gray-600" />
              <span className="ml-0 overflow-hidden max-w-0 group-hover:max-w-[80px] opacity-0 group-hover:opacity-100 transition-all duration-300 text-gray-600 text-sm whitespace-nowrap">
                Annuler
              </span>
            </button>
          )}

          {/* EDIT / SAVE */}
          <button
            onClick={editing ? handleSave : () => setEditing(true)}
            disabled={loading}
            className={`group flex items-center h-11 px-3 rounded-lg transition-all duration-300
              ${editing ? "bg-green-50 hover:bg-green-100" : "bg-gray-100 hover:bg-orange-50"}
            `}
          >
            {editing ? (
              <>
                <Save className="w-5 h-5 text-green-600" />
                <span className="ml-0 overflow-hidden max-w-0 group-hover:max-w-[120px] opacity-0 group-hover:opacity-100 transition-all duration-300 text-green-600 text-sm whitespace-nowrap">
                  {loading ? "..." : "Enregistrer"}
                </span>
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                <span className="ml-0 overflow-hidden max-w-0 group-hover:max-w-[100px] opacity-0 group-hover:opacity-100 transition-all duration-300 text-orange-600 text-sm whitespace-nowrap">
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
