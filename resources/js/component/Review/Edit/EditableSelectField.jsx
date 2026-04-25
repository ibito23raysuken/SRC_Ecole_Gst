import { useState, useContext, useEffect } from "react";
import { Edit3, Save, X } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { getAllSchoolClassesApi } from "../../../api/apiSchoolClasses";
import { AppContext } from "../../../Context/AppContext";
import { toast } from "react-hot-toast";

export default function EditableSelectField({
  field,
  label,
  value,
  displayValue,
  options,
  student,
  updateStudentField,
}) {
  const { token } = useContext(AppContext);
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getAllSchoolClassesApi(token);
      setClasses(data);
    } catch (error) {
      console.error("Erreur lors du chargement des classes:", error);
      toast.error("Erreur lors du chargement des classes");
    }
  };

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
        {/* VIEW / SELECT */}
        {!editing ? (
          <div className="flex-1 min-w-0 h-11 px-3 rounded-lg flex items-center text-gray-800 bg-gray-50">
            {displayValue || "Non assigné"}
          </div>
        ) : (
          <select
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            disabled={loading}
            className="
              flex-1 min-w-0 h-11 px-3 border rounded-lg text-base
              focus:ring-2 focus:ring-blue-500 outline-none
            "
            autoFocus
          >
            <option value="">Sélectionner une classe</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.level})
              </option>
            ))}
          </select>
        )}

        {/* ACTIONS */}
        <div className="flex gap-2 shrink-0">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="
                group flex items-center h-11 px-3 rounded-lg
                bg-gray-100 hover:bg-blue-50
                transition-all duration-300 shrink-0
              "
            >
              <Edit3 className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="
                  group flex items-center h-11 px-3 rounded-lg
                  bg-green-100 hover:bg-green-200 disabled:opacity-50
                  transition-all duration-300 shrink-0
                "
              >
                <Save className="w-5 h-5 text-green-600" />
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="
                  group flex items-center h-11 px-3 rounded-lg
                  bg-gray-100 hover:bg-red-50 disabled:opacity-50
                  transition-all duration-300 shrink-0
                "
              >
                <X className="w-5 h-5 text-gray-600 hover:text-red-600" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
