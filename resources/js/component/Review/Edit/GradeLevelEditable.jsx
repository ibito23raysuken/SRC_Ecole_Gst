import { useState, useContext } from "react";
import { Save } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";
import { toast } from "react-hot-toast";

export default function GradeLevelEditable({ student, updateStudentField }) {

  const { token } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const classes = [
    "PS","MS","GS",
    "CP","CE1","CE2",
    "CM1","CM2",
    "6e","5e","4e","3e",
    "2nde","1ère","Term"
  ];

  const [gradeLevel, setGradeLevel] = useState(student.grade_level);

  // ===============================
  // SAVE
  // ===============================
  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await updateStudentApi(
        student.id,
        { grade_level: gradeLevel }
      );

      // 🔥 Mise à jour parent + toast global
      updateStudentField(res, "Classe mise à jour ✅");

      setIsEditing(false);

    } catch (error) {
      console.error(error);
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat().join(", ");
        toast.error(errorMessages || "Erreur lors de la modification ❌", {
          position: "top-right",
        });
      } else {
        toast.error("Erreur lors de la modification ❌", {
          position: "top-right",
        });
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isEditing ? (
        <div className="flex gap-2 items-center">

          <select
            className="border p-2 rounded"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            disabled={loading}
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-3 py-1 bg-red-600 text-white rounded-md disabled:bg-gray-400"
          >
            <Save className="inline-block w-4 h-4 mr-1" />
            {loading ? "..." : "Sauvegarder"}
          </button>

          <button
            onClick={() => {
              setGradeLevel(student.grade_level); // reset valeur
              setIsEditing(false);
            }}
            disabled={loading}
            className="bg-gray-500 text-white px-3 py-1 rounded disabled:bg-gray-400"
          >
            Annuler
          </button>

        </div>
      ) : (
        <span
          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium cursor-pointer hover:bg-red-200"
          onClick={() => setIsEditing(true)}
        >
          {gradeLevel || "Non défini"}
        </span>
      )}
    </div>
  );
}
