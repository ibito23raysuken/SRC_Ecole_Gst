import { useState, useEffect, useContext } from "react";
import { Edit3, Save, X } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";
import { toast } from "react-hot-toast";

export default function EditableFullName({ student, updateStudentField }) {
  const { token } = useContext(AppContext);

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 état local pour éviter le bug d'affichage
  const [localStudent, setLocalStudent] = useState(student);

  // Sync avec props
  useEffect(() => {
    setLocalStudent(student);
    setFirstName(student.first_name || "");
    setLastName(student.last_name || "");
  }, [student]);

  const handleSave = async () => {
    if (!student?.id) return;

    if (
      firstName.trim() === student.first_name?.trim() &&
      lastName.trim() === student.last_name?.trim()
    ) {
      setEditing(false);
      return;
    }

    setLoading(true);

    try {
      const updatedData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      };

      const updatedStudent = await updateStudentApi(
        student.id,
        updatedData
      );

      // 🔥 update local immédiat
      setLocalStudent(updatedStudent);

      // 🔥 update parent
      updateStudentField(updatedStudent, "Nom et prénom mis à jour ✅");

      setEditing(false);
    } catch (error) {
      console.error(error);
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat().join(", ");
        toast.error(errorMessages || "Erreur lors de la sauvegarde ❌");
      } else {
        toast.error("Erreur lors de la sauvegarde ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFirstName(localStudent.first_name || "");
    setLastName(localStudent.last_name || "");
    setEditing(false);
  };

  return (
    <div className="mb-3">
      {!editing ? (
        <div className="flex items-center gap-3">
          {/* 🔥 affichage */}
          <h1 className="text-3xl font-bold text-red-600">
            {localStudent.first_name} {localStudent.last_name}
          </h1>

          {/* 🔥 bouton EDIT stylé */}
          <button
            onClick={() => setEditing(true)}
            className="group flex items-center h-11 px-3 rounded-lg bg-gray-100 hover:bg-orange-50 transition-all duration-300"
          >
            <Edit3 className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
            <span className="ml-0 overflow-hidden max-w-0 group-hover:max-w-[100px] opacity-0 group-hover:opacity-100 transition-all duration-300 text-orange-600 text-sm whitespace-nowrap">
              Modifier
            </span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* INPUTS */}
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border p-2 rounded w-32"
            placeholder="Prénom"
          />

          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border p-2 rounded w-32"
            placeholder="Nom"
          />

          {/* 🔥 bouton SAVE stylé */}
          <button
            onClick={handleSave}
            disabled={loading}
            className={`group flex items-center h-11 px-3 rounded-lg transition-all duration-300
              bg-green-50 hover:bg-green-100
              ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <Save className="w-5 h-5 text-green-600" />
            <span className="ml-0 overflow-hidden max-w-0 group-hover:max-w-[120px] opacity-0 group-hover:opacity-100 transition-all duration-300 text-green-600 text-sm whitespace-nowrap">
              {loading ? "..." : "Enregistrer"}
            </span>
          </button>

          {/* 🔥 bouton CANCEL stylé */}
          <button
            onClick={handleCancel}
            disabled={loading}
            className="group flex items-center h-11 px-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all duration-300"
          >
            <X className="w-5 h-5 text-gray-700" />
            <span className="ml-0 overflow-hidden max-w-0 group-hover:max-w-[100px] opacity-0 group-hover:opacity-100 transition-all duration-300 text-gray-700 text-sm whitespace-nowrap">
              Annuler
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
