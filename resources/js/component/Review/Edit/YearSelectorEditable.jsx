import { useState, useContext } from "react";
import { Edit3, Save } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";
import { toast } from "react-hot-toast";

export default function YearSelectorEditable({ student, updateStudentField }) {
  const [isEditing, setIsEditing] = useState(false);
  const { token } = useContext(AppContext);

  const currentYear = new Date().getFullYear();

  // Liste années (ex: 2015 → 2035)
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  const [academicYear, setAcademicYear] = useState(student.academic_year);

  // ===============================
  // SAVE
  // ===============================
  const handleSave = async () => {
    try {
      const res = await updateStudentApi(
        student.id,
        { academic_year: academicYear }
      );

      // 🔥 Met à jour le parent + déclenche toast
      updateStudentField(res, "Année scolaire mise à jour ✅");

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
    }
  };

  return (
    <div className="mt-1">
      {isEditing ? (
        <div className="flex gap-2 items-center">

          <select
            className="border p-2 rounded"
            value={academicYear}
            onChange={(e) => setAcademicYear(parseInt(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <button
            onClick={handleSave}
            className="px-3 py-1 bg-red-600 text-white rounded-md"
          >
            <Save className="w-4 h-4 inline-block mr-1" />
            Sauvegarder
          </button>

          <button
            onClick={() => {
              setAcademicYear(student.academic_year); // reset
              setIsEditing(false);
            }}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Annuler
          </button>

        </div>
      ) : (
        <p
          className="text-gray-600 cursor-pointer hover:text-red-600"
          onClick={() => setIsEditing(true)}
        >
          Année d’inscription : <b>{academicYear}</b>
        </p>
      )}
    </div>
  );
}
