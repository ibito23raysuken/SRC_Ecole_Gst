import React, { useEffect, useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { getFreeClassByLevelApi } from "../../api/apiSchoolClasses";

export default function AcademicInfoSection({ student, setStudent }) {
  const { token } = useContext(AppContext);

  const gradeLevels = [
    "PS","MS","GS","CP","CE1","CE2","CM1","CM2",
    "6e","5e","4e","3e","2nde","1ère","Term"
  ];

  const getNextLevel = (current) => {
    const index = gradeLevels.indexOf(current);
    return index !== -1 ? gradeLevels[index + 1] || "" : "";
  };

  // ⚡ Auto-niveau et classe bloqués dès choix de previous_class
  useEffect(() => {
    const fetchFreeClass = async () => {
      if (!student.previous_class) return;

      const nextLevel = getNextLevel(student.previous_class);

      try {
        const freeClass = await getFreeClassByLevelApi(nextLevel, token);
          console.log("AcademicInfoSection rendered with student:", freeClass);
        setStudent(prev => ({
          ...prev,
          grade_level: nextLevel,                     // automatiquement rempli
          current_class: freeClass?.name || ""       // automatiquement rempli
        }));

      } catch (err) {
        console.error("Erreur classe libre", err);
      }
    };

    fetchFreeClass();
  }, [student.previous_class]);

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-xl font-bold mb-4">Informations académiques</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Classe précédente */}
        <select
          name="previous_class"
          value={student.previous_class || ""}
          onChange={(e) =>
            setStudent(prev => ({ ...prev, previous_class: e.target.value }))
          }
          className="w-full p-3 border rounded-lg"
        >
          <option value="">-- Classe précédente --</option>
          {gradeLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        {/* Niveau actuel bloqué */}
        <input
          value={student.grade_level || ""}
          disabled
          className="w-full p-3 border rounded-lg bg-gray-100"
          placeholder="Niveau automatique"
        />

        {/* Classe actuelle bloquée */}
        <input
          value={student.current_class || ""}
          disabled
          className="w-full p-3 border rounded-lg bg-gray-100"
          placeholder="Classe automatique"
        />

      </div>
    </div>
  );
}
