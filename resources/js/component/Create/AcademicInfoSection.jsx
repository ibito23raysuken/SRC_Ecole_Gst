
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import {
  getAllSchoolClassesApi,
  getFreeClassByLevelApi,
} from "../../api/apiSchoolClasses";

const LEVEL_ORDER = [
  "PS", "MS", "GS", "CP", "CE1", "CE2", "CM1", "CM2",
  "6e", "5e", "4e", "3e", "2nde", "1ère", "Term",
];

export default function AcademicInfoSection({ student, setStudent }) {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [allClasses, setAllClasses] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [classesError, setClassesError] = useState(false);

  // Récupérer les classes existantes pour proposer les niveaux précédents
  useEffect(() => {
    let cancelled = false;

    const fetchClasses = async () => {
      try {
        const classes = await getAllSchoolClassesApi(token);

        if (!cancelled) {
          setAllClasses(Array.isArray(classes) ? classes : []);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des classes :", error);
      }
    };

    if (token) fetchClasses();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // Calculer le niveau actuel à partir du niveau précédent
  useEffect(() => {
    const previousLevel = student.previous_level || "";
    const index = LEVEL_ORDER.indexOf(previousLevel);
    const nextLevel =
      index >= 0 && index < LEVEL_ORDER.length - 1
        ? LEVEL_ORDER[index + 1]
        : "";

    setStudent((prev) => {
      if (prev.grade_level === nextLevel) return prev;

      return {
        ...prev,
        grade_level: nextLevel,
        current_class: "",
        school_class_id: null,
      };
    });
  }, [student.previous_level, setStudent]);

  // Charger les classes libres du niveau actuel
  useEffect(() => {
    let cancelled = false;

    const fetchAvailableClasses = async () => {
      setAvailableClasses([]);
      setClassesError(false);

      const previousLevel = student.previous_level || "";
      const index = LEVEL_ORDER.indexOf(previousLevel);
      const nextLevel =
        index >= 0 && index < LEVEL_ORDER.length - 1
          ? LEVEL_ORDER[index + 1]
          : "";

      if (!nextLevel || !token) {
        setLoadingClasses(false);
        return;
      }

      setLoadingClasses(true);

      try {
        const result = await getFreeClassByLevelApi(nextLevel, token);

        if (cancelled) return;

        const classes = Array.isArray(result) ? result : [];
        setAvailableClasses(classes);

        // Vérifier que la classe précédemment sélectionnée existe encore
        const selectedId = student.school_class_id;
        const selectedClass = classes.find(
          (c) => Number(c.id) === Number(selectedId)
        );

        if (selectedId && !selectedClass) {
          setStudent((prev) => ({
            ...prev,
            school_class_id: null,
            current_class: "",
          }));
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Erreur lors de la récupération des classes disponibles :",
            error
          );
          setClassesError(true);
        }
      } finally {
        if (!cancelled) setLoadingClasses(false);
      }
    };

    fetchAvailableClasses();

    return () => {
      cancelled = true;
    };
  }, [student.previous_level, token, setStudent]);

  // Afficher les niveaux dans l'ordre scolaire défini
  const previousLevels = LEVEL_ORDER.filter((level) =>
    allClasses.some((schoolClass) => schoolClass.level === level)
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-red-800">
        Informations académiques
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ancienne école */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Ancienne école</label>
          <input
            type="text"
            value={student.previous_school || ""}
            onChange={(e) =>
              setStudent((prev) => ({
                ...prev,
                previous_school: e.target.value,
              }))
            }
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* Niveau précédent */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Niveau précédent</label>
          <select
            value={student.previous_level || ""}
            onChange={(e) =>
              setStudent((prev) => ({
                ...prev,
                previous_level: e.target.value,
              }))
            }
            className="w-full p-3 border rounded-lg"
          >
            <option value="">-- Sélectionner le niveau --</option>
            {previousLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
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

        {!student.previous_level ? (
          <p className="p-3 rounded-lg bg-gray-50 text-gray-600">
            Sélectionnez d'abord le niveau précédent.
          </p>
        ) : loadingClasses ? (
          <p className="p-3 rounded-lg bg-gray-50 text-gray-600">
            Chargement des classes disponibles...
          </p>
        ) : classesError ? (
          <p className="p-3 rounded-lg bg-red-50 text-red-700">
            Impossible de récupérer les classes. Veuillez réessayer.
          </p>
        ) : !student.grade_level ? (
          <p className="p-3 rounded-lg bg-yellow-50 text-yellow-700">
            Aucun niveau suivant n'est défini pour ce niveau.
          </p>
        ) : availableClasses.length === 0 ? (
          <div className="p-3 border rounded-lg bg-yellow-50 text-yellow-700 font-medium flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <span>Aucune classe disponible pour ce niveau.</span>
            <button
              type="button"
              onClick={() => navigate("/SchoolClass/create")}
              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              + Nouvelle classe
            </button>
          </div>
        ) : (
          <select
            value={student.school_class_id || ""}
            onChange={(e) => {
              const selectedId = e.target.value
                ? Number(e.target.value)
                : null;

              const selectedClass = availableClasses.find(
                (c) => Number(c.id) === selectedId
              );

              setStudent((prev) => ({
                ...prev,
                school_class_id: selectedId,
                current_class: selectedClass?.name || "",
              }));
            }}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">-- Sélectionner la classe --</option>
            {availableClasses.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
