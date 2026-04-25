import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // ✅ AJOUT
import { AppContext } from "../../Context/AppContext";
import { getAllSchoolClassesApi, getFreeClassByLevelApi } from "../../api/apiSchoolClasses";

export default function AcademicInfoSection({ student, setStudent }) { // ❌ enlever navigate

  const { token } = useContext(AppContext);
  const navigate = useNavigate(); // ✅ FIX

  const [allClasses, setAllClasses] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [noClassMessage, setNoClassMessage] = useState(false);

  // ⚡ Récupération de toutes les classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await getAllSchoolClassesApi(token);
        setAllClasses(classes || []);
      } catch (err) {
        console.error("Erreur récupération classes", err);
      }
    };
    fetchClasses();
  }, [token]);

  // ⚡ Gestion niveau → classes disponibles
  useEffect(() => {
    if (!student.previous_level) return;

    const levelOrder = [
      "PS","MS","GS","CP","CE1","CE2","CM1","CM2",
      "6e","5e","4e","3e","2nde","1ère","Term"
    ];

    const index = levelOrder.indexOf(student.previous_level);
    const nextLevel = index !== -1 ? levelOrder[index + 1] || "" : "";

    setStudent(prev => ({
      ...prev,
      grade_level: nextLevel,
      current_class: "",
      // Only reset school_class_id if the grade_level actually changed
      ...(prev.grade_level !== nextLevel ? { school_class_id: null } : {})
    }));

    const fetchAvailable = async () => {
      // ✅ sécurité
      if (!nextLevel) {
        setAvailableClasses([]);
        setNoClassMessage(true);
        return;
      }

      try {
        const freeClasses = await getFreeClassByLevelApi(nextLevel, token);

        if (Array.isArray(freeClasses) && freeClasses.length > 0) {
          setAvailableClasses(freeClasses);
          setNoClassMessage(false);
        } else {
          setAvailableClasses([]);
          setNoClassMessage(true);
        }
      } catch (err) {
        console.error("Erreur récupération classes disponibles", err);
        setAvailableClasses([]);
        setNoClassMessage(true);
      }
    };

    fetchAvailable();

  }, [student.previous_level, token, setStudent]);

  // ⚡ niveaux uniques
  const previousLevels = Array.from(new Set(allClasses.map(c => c.level)));
  console.log("student render, previous_level:", student, "availableClasses:", availableClasses, "noClassMessage:", noClassMessage);
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Informations académiques</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Ancienne école */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Ancienne école</label>
          <input
            type="text"
            value={student.previous_school || ""}
            onChange={e => setStudent(prev => ({ ...prev, previous_school: e.target.value }))}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* Niveau précédent */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Niveau précédent</label>
          <select
            value={student.previous_level || ""}
            onChange={e => setStudent(prev => ({ ...prev, previous_level: e.target.value }))}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">-- Sélectionner le niveau --</option>
            {previousLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Niveau actuel */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Niveau actuel</label>
          <input
            type="text"
            value={student.grade_level || ""}
            disabled
            className="w-full p-3 border rounded-lg bg-gray-100"
          />
        </div>

      </div>

      {/* Classe actuelle */}
      <div className="mt-4 flex flex-col">
        <label className="mb-1 font-medium">Classe actuelle</label>

        {noClassMessage ? (
          <div className="p-3 border rounded-lg bg-yellow-50 text-yellow-700 font-medium flex justify-between items-center">
            <span>Aucune classe disponible pour ce niveau.</span>

            <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/SchoolClass/create");
                }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
                + Nouvelle classe
            </button>
            </div>
        ) : (
          <select
            value={student.school_class_id || ""}
            onChange={e => {
              const selectedId = e.target.value ? Number(e.target.value) : null;
              const selectedClass = availableClasses.find(c => c.id == selectedId);
              setStudent(prev => ({
                ...prev,
                school_class_id: selectedId,
                current_class: selectedClass?.name || ""
              }));
            }}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">-- Sélectionner la classe --</option>
            {availableClasses.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
