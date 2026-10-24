import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Save,
  Printer,
  ChevronDown,
  BookOpen,
  Users,
  Calendar,
  ClipboardList,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { AppContext } from "../../Context/AppContext";
import { useContext } from "react";

// ============================================================
// CONFIGURATION API
// ============================================================

const API_URL = import.meta.env.VITE_API_URL || "/api";

// ============================================================
// HELPERS
// ============================================================

function getMention(avg) {
  if (avg === null) {
    return {
      t: "—",
      cls: "bg-gray-100 text-gray-500",
    };
  }

  if (avg >= 16) {
    return {
      t: "Très Bien",
      cls: "bg-green-100 text-green-800",
    };
  }

  if (avg >= 14) {
    return {
      t: "Bien",
      cls: "bg-green-50 text-green-700",
    };
  }

  if (avg >= 12) {
    return {
      t: "Assez Bien",
      cls: "bg-yellow-50 text-yellow-700",
    };
  }

  if (avg >= 10) {
    return {
      t: "Passable",
      cls: "bg-yellow-50 text-yellow-600",
    };
  }

  return {
    t: "Insuffisant",
    cls: "bg-red-100 text-red-700",
  };
}

function getNoteCls(n) {
  if (n >= 16) return "bg-green-100 text-green-800";
  if (n >= 14) return "bg-green-50 text-green-700";
  if (n >= 12) return "bg-yellow-50 text-yellow-700";
  if (n >= 10) return "bg-yellow-50 text-yellow-600";

  return "bg-red-100 text-red-700";
}

function getApprMatiere(n) {
  if (n >= 16) return "Excellent travail";
  if (n >= 14) return "Bon travail";
  if (n >= 12) return "Assez bien";
  if (n >= 10) return "Résultats passables";

  return "Insuffisant";
}

function getApprGen(avg) {
  if (avg === null) {
    return "En attente des notes.";
  }

  if (avg >= 16) {
    return "Excellents résultats. Félicitations pour ce travail remarquable.";
  }

  if (avg >= 14) {
    return "Bons résultats. Élève sérieux(se) et investi(e). Continuez ainsi.";
  }

  if (avg >= 12) {
    return "Résultats satisfaisants. Des efforts réguliers permettront de progresser.";
  }

  if (avg >= 10) {
    return "Résultats passables. Un travail plus soutenu est nécessaire.";
  }

  return "Résultats insuffisants. Des efforts importants sont indispensables.";
}

// ============================================================
// NORMALISATION DES REPONSES API
// ============================================================

function extractData(response) {
  if (!response) return [];

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }

  return response.data || [];
}

// ============================================================
// SELECT
// ============================================================

function Select({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full appearance-none border border-gray-300 rounded px-3 py-2 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition
          ${
            disabled
              ? "opacity-40 cursor-not-allowed bg-gray-50"
              : "cursor-pointer hover:border-red-400"
          }`}
      >
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => {
          const value =
            typeof option === "object"
              ? option.value
              : option;

          const label =
            typeof option === "object"
              ? option.label
              : option;

          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>

      <ChevronDown
        size={14}
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
          disabled ? "text-gray-300" : "text-red-600"
        }`}
      />
    </div>
  );
}

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
  icon: Icon,
  stepNum,
  title,
}) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
      <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {stepNum}
      </div>

      <Icon
        size={15}
        className="text-red-600"
      />

      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
        {title}
      </h3>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================

export default function NotesPage() {
  const { token } = useContext(AppContext);

  // ----------------------------------------------------------
  // ETAT
  // ----------------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [classesData, setClassesData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [subjectsData, setSubjectsData] = useState([]);

  const [settings, setSettings] = useState(null);

  const [niveau, setNiveau] = useState("");
  const [classe, setClasse] = useState("");
  const [eleve, setEleve] = useState("");

  const [annee, setAnnee] = useState("");

  const [trim, setTrim] = useState(
    "1er Trimestre"
  );

  const [notes, setNotes] = useState({});

  const [saveMsg, setSaveMsg] = useState("");

  // ----------------------------------------------------------
  // CONFIG AXIOS
  // ----------------------------------------------------------

  const axiosConfig = useMemo(
    () => ({
      headers: {
        Accept: "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    }),
    [token]
  );

  // ----------------------------------------------------------
  // CHARGER LES DONNEES
  // ----------------------------------------------------------

  const loadData = async (showRefresh = false) => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [
        classesResponse,
        studentsResponse,
        subjectsResponse,
        settingsResponse,
      ] = await Promise.all([
        axios.get(
          `${API_URL}/school-classes`,
          axiosConfig
        ),

        axios.get(
          `${API_URL}/students`,
          axiosConfig
        ),

        axios.get(
          `${API_URL}/subjects`,
          axiosConfig
        ),

        axios.get(
          `${API_URL}/settings`,
          axiosConfig
        ),
      ]);

      // ------------------------------------------------------
      // CLASSES
      // ------------------------------------------------------

      const classes = extractData(
        classesResponse
      );

      // ------------------------------------------------------
      // ELEVES
      // ------------------------------------------------------

      const students = extractData(
        studentsResponse
      );

      // ------------------------------------------------------
      // MATIERES
      // ------------------------------------------------------

      const subjects = extractData(
        subjectsResponse
      );

      // ------------------------------------------------------
      // SETTINGS
      // ------------------------------------------------------

      const settingsResult =
        settingsResponse?.data?.data ||
        settingsResponse?.data ||
        null;

      setClassesData(
        Array.isArray(classes)
          ? classes
          : []
      );

      setStudentsData(
        Array.isArray(students)
          ? students
          : []
      );

      setSubjectsData(
        Array.isArray(subjects)
          ? subjects
          : []
      );

      setSettings(settingsResult);

      // ------------------------------------------------------
      // ANNEE SCOLAIRE
      // ------------------------------------------------------

      if (
        settingsResult?.academic_year
      ) {
        setAnnee(
          settingsResult.academic_year
        );
      }
    } catch (error) {
      console.error(
        "Erreur chargement données NotesPage :",
        error
      );

      setSaveMsg(
        "⚠ Impossible de récupérer les données depuis la base de données."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // ==========================================================
  // NIVEAUX DISPONIBLES
  // ==========================================================

  const niveaux = useMemo(() => {
    const result = [];

    classesData.forEach((item) => {
      const niveauValue =
        item.niveau ||
        item.level ||
        item.classe_niveau ||
        item.name;

      if (!niveauValue) return;

      // Si le champ level existe
      if (
        item.niveau ||
        item.level ||
        item.classe_niveau
      ) {
        if (!result.includes(niveauValue)) {
          result.push(niveauValue);
        }

        return;
      }

      // Sinon essayer de récupérer le niveau
      // depuis le nom de classe
      const name =
        item.name || "";

      const match = name.match(
        /^(6ème|5ème|4ème|3ème|2nde|1ère|Terminale|PS|MS|GS|CP|CE1|CE2|CM1|CM2)/
      );

      if (match) {
        if (!result.includes(match[1])) {
          result.push(match[1]);
        }
      }
    });

    return result;
  }, [classesData]);

  // ==========================================================
  // FONCTION POUR DETERMINER LE NIVEAU D'UNE CLASSE
  // ==========================================================

  const getClassLevel = (schoolClass) => {
    if (!schoolClass) return "";

    return (
      schoolClass.niveau ||
      schoolClass.level ||
      schoolClass.classe_niveau ||
      schoolClass.grade ||
      ""
    );
  };

  // ==========================================================
  // CLASSES DU NIVEAU SELECTIONNE
  // ==========================================================

  const classes = useMemo(() => {
    if (!niveau) return [];

    return classesData.filter(
      (item) => {
        const itemLevel =
          getClassLevel(item);

        // Cas normal : la BDD possède niveau/level
        if (itemLevel) {
          return (
            String(itemLevel).toLowerCase() ===
            String(niveau).toLowerCase()
          );
        }

        // Sinon comparaison sur le nom
        const name =
          item.name ||
          item.nom ||
          "";

        return name
          .toLowerCase()
          .startsWith(
            String(niveau).toLowerCase()
          );
      }
    );
  }, [
    classesData,
    niveau,
  ]);

  // ==========================================================
  // ELEVES DE LA CLASSE
  // ==========================================================

  const elevesListe = useMemo(() => {
    if (!classe) return [];

    const selectedClass = classesData.find(
      (item) =>
        String(item.id) ===
        String(classe)
    );

    if (!selectedClass) return [];

    return studentsData.filter(
      (student) => {
        // Plusieurs noms possibles selon votre modèle
        const studentClassId =
          student.school_class_id ??
          student.class_id ??
          student.classe_id;

        return (
          String(studentClassId) ===
          String(selectedClass.id)
        );
      }
    );
  }, [
    studentsData,
    classesData,
    classe,
  ]);

  // ==========================================================
  // MATIERES
  // ==========================================================

  const matieres = useMemo(() => {
    if (!niveau) return [];

    // --------------------------------------------------------
    // 1. Si les matières possèdent un niveau
    // --------------------------------------------------------

    const withLevel =
      subjectsData.filter(
        (subject) =>
          subject.niveau ||
          subject.level ||
          subject.grade
      );

    if (withLevel.length > 0) {
      return withLevel.filter(
        (subject) => {
          const subjectLevel =
            subject.niveau ||
            subject.level ||
            subject.grade;

          return (
            String(subjectLevel).toLowerCase() ===
            String(niveau).toLowerCase()
          );
        }
      );
    }

    // --------------------------------------------------------
    // 2. Si les matières sont liées à une classe
    // --------------------------------------------------------

    const selectedClass =
      classesData.find(
        (item) =>
          String(item.id) ===
          String(classe)
      );

    if (selectedClass) {
      const classSubjects =
        subjectsData.filter(
          (subject) => {
            const subjectClassId =
              subject.school_class_id ??
              subject.class_id ??
              subject.classe_id;

            return (
              subjectClassId &&
              String(subjectClassId) ===
                String(selectedClass.id)
            );
          }
        );

      if (classSubjects.length > 0) {
        return classSubjects;
      }
    }

    // --------------------------------------------------------
    // 3. Sinon toutes les matières
    // --------------------------------------------------------

    return subjectsData;
  }, [
    subjectsData,
    classesData,
    niveau,
    classe,
  ]);

  // ==========================================================
  // NOM D'UNE CLASSE
  // ==========================================================

  const selectedClass = useMemo(() => {
    return classesData.find(
      (item) =>
        String(item.id) ===
        String(classe)
    );
  }, [
    classesData,
    classe,
  ]);

  const classeNom =
    selectedClass?.name ||
    selectedClass?.nom ||
    selectedClass?.label ||
    "";

  // ==========================================================
  // ELEVE SELECTIONNE
  // ==========================================================

  const selectedStudent = useMemo(() => {
    return studentsData.find(
      (student) =>
        String(student.id) ===
        String(eleve)
    );
  }, [
    studentsData,
    eleve,
  ]);

  const eleveNom = selectedStudent
    ? [
        selectedStudent.first_name ||
          selectedStudent.firstname ||
          selectedStudent.prenom ||
          "",
        selectedStudent.last_name ||
          selectedStudent.lastname ||
          selectedStudent.nom ||
          "",
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  // ==========================================================
  // ANNEE SCOLAIRE
  // ==========================================================

  const academicYear =
    annee ||
    settings?.academic_year ||
    "";

  // ==========================================================
  // CHANGEMENT NIVEAU
  // ==========================================================

  const handleNiveau = (value) => {
    setNiveau(value);

    setClasse("");
    setEleve("");
    setNotes({});
  };

  // ==========================================================
  // CHANGEMENT CLASSE
  // ==========================================================

  const handleClasse = (value) => {
    setClasse(value);

    setEleve("");
    setNotes({});
  };

  // ==========================================================
  // CHANGEMENT ELEVE
  // ==========================================================

  const handleEleve = (value) => {
    setEleve(value);

    // Réinitialiser les notes lors d'un changement d'élève
    setNotes({});
    setSaveMsg("");
  };

  // ==========================================================
  // CHANGEMENT NOTE
  // ==========================================================

  const handleNoteChange = (
    subject,
    value
  ) => {
    if (value === "") {
      setNotes((prev) => ({
        ...prev,
        [subject]: "",
      }));

      return;
    }

    let number =
      parseFloat(value);

    if (isNaN(number)) {
      return;
    }

    if (number < 0) {
      number = 0;
    }

    if (number > 20) {
      number = 20;
    }

    setNotes((prev) => ({
      ...prev,
      [subject]: number,
    }));
  };

  // ==========================================================
  // CALCUL MOYENNE
  // ==========================================================

  const calcAvg = () => {
    const values = matieres
      .map((subject) => {
        const key =
          subject.name ||
          subject.nom ||
          subject.label ||
          subject.id;

        return parseFloat(
          notes[key]
        );
      })
      .filter(
        (value) =>
          !isNaN(value)
      );

    if (!values.length) {
      return null;
    }

    return (
      values.reduce(
        (total, value) =>
          total + value,
        0
      ) / values.length
    );
  };

  const avg = calcAvg();

  const mention =
    getMention(avg);

  // ==========================================================
  // SAUVEGARDE
  // ==========================================================

  const handleSave = async () => {
    if (!niveau) {
      setSaveMsg(
        "⚠ Choisissez un niveau."
      );
      return;
    }

    if (!classe) {
      setSaveMsg(
        "⚠ Choisissez une classe."
      );
      return;
    }

    if (!eleve) {
      setSaveMsg(
        "⚠ Choisissez un élève."
      );
      return;
    }

    const hasNotes =
      Object.values(notes).some(
        (value) =>
          value !== "" &&
          value !== null &&
          value !== undefined
      );

    if (!hasNotes) {
      setSaveMsg(
        "⚠ Saisissez au moins une note."
      );
      return;
    }

    /*
     * IMPORTANT :
     *
     * Ici les notes sont préparées.
     *
     * Il faudra une table "notes" côté Laravel
     * et une route POST /api/notes pour les enregistrer
     * définitivement.
     */

    const payload = {
      student_id: selectedStudent?.id,
      school_class_id:
        selectedClass?.id,
      academic_year:
        academicYear,
      trimestre: trim,
      notes: matieres.map(
        (subject) => {
          const subjectId =
            subject.id;

          const subjectName =
            subject.name ||
            subject.nom ||
            subject.label;

          return {
            subject_id:
              subjectId,
            subject_name:
              subjectName,
            note:
              notes[
                subjectName
              ] ?? null,
          };
        }
      ),
    };

    console.log(
      "Payload bulletin :",
      payload
    );

    /*
     * Décommenter lorsque votre
     * endpoint Laravel /api/notes existe :
     *
     * try {
     *   await axios.post(
     *     `${API_URL}/notes`,
     *     payload,
     *     axiosConfig
     *   );
     *
     *   setSaveMsg(
     *     "✓ Bulletin enregistré avec succès"
     *   );
     * } catch (error) {
     *   console.error(error);
     *   setSaveMsg(
     *     "⚠ Erreur lors de l'enregistrement."
     *   );
     * }
     */

    setSaveMsg(
      "✓ Données du bulletin préparées avec succès"
    );

    setTimeout(() => {
      setSaveMsg("");
    }, 3000);
  };

  // ==========================================================
  // IMPRESSION
  // ==========================================================

  const handlePrint = () => {
    const element =
      document.getElementById(
        "bul-content"
      );

    if (!element) return;

    const windowPrint =
      window.open(
        "",
        "_blank"
      );

    if (!windowPrint) {
      setSaveMsg(
        "⚠ Autorisez les fenêtres popup pour imprimer."
      );

      return;
    }

    windowPrint.document.write(`
      <!DOCTYPE html>

      <html lang="fr">

      <head>

        <meta charset="UTF-8">

        <title>
          Bulletin de notes
        </title>

        <style>

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: Arial, sans-serif;
            padding: 32px;
            max-width: 800px;
            margin: auto;
            color: #111827;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            padding: 8px 10px;
            border-bottom: 1px solid #eee;
            font-size: 12px;
          }

          thead {
            background: #dc2626;
            color: white;
          }

          @media print {

            body {
              padding: 12px;
            }

          }

        </style>

      </head>

      <body>

        ${element.innerHTML}

      </body>

      </html>
    `);

    windowPrint.document.close();

    setTimeout(() => {
      windowPrint.print();
    }, 500);
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">

        <div className="flex flex-col items-center gap-3">

          <Loader2
            size={30}
            className="animate-spin text-red-600"
          />

          <p className="text-sm text-gray-500">
            Chargement des données...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="flex relative min-h-screen bg-gray-100 font-sans">

      {/* =====================================================
          PANNEAU GAUCHE
      ====================================================== */}

      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">

        {/* HEADER */}

        <div className="bg-red-600 px-5 py-4">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-white font-semibold text-base">
                Gestion des Bulletins
              </h1>

              <p className="text-red-200 text-xs mt-0.5 uppercase tracking-widest">
                {academicYear ||
                  "Année scolaire"}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                loadData(true)
              }
              disabled={refreshing}
              className="p-2 rounded hover:bg-red-700 transition text-white"
              title="Actualiser"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

          </div>

        </div>

        {/* FORMULAIRE */}

        <div className="p-5 space-y-6 flex-1">

          {/* =================================================
              ETAPE 1
          ================================================== */}

          <div>

            <SectionHeader
              icon={BookOpen}
              stepNum={1}
              title="Niveau & Classe"
            />

            <div className="space-y-3">

              {/* NIVEAU */}

              <div>

                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Niveau
                </label>

                <Select
                  value={niveau}
                  onChange={
                    handleNiveau
                  }
                  placeholder="— Choisir un niveau —"
                  options={niveaux}
                />

              </div>

              {/* CLASSE */}

              <div>

                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Classe
                </label>

                <Select
                  value={classe}
                  onChange={
                    handleClasse
                  }
                  placeholder="— Choisir d'abord un niveau —"
                  options={classes.map(
                    (item) => ({
                      value:
                        item.id,
                      label:
                        item.name ||
                        item.nom ||
                        item.label ||
                        `Classe ${item.id}`,
                    })
                  )}
                  disabled={
                    !niveau
                  }
                />

              </div>

            </div>

          </div>

          <hr className="border-gray-200" />

          {/* =================================================
              ETAPE 2
          ================================================== */}

          <div>

            <SectionHeader
              icon={Users}
              stepNum={2}
              title="Élève"
            />

            <div>

              <label className="block text-xs font-medium text-gray-500 mb-1">
                Sélectionner l'élève
              </label>

              <Select
                value={eleve}
                onChange={
                  handleEleve
                }
                placeholder="— Choisir d'abord une classe —"
                options={elevesListe.map(
                  (student) => ({
                    value:
                      student.id,

                    label:
                      [
                        student.first_name ||
                          student.firstname ||
                          student.prenom ||
                          "",

                        student.last_name ||
                          student.lastname ||
                          student.nom ||
                          "",
                      ]
                        .filter(Boolean)
                        .join(" ") ||
                      `Élève ${student.id}`,
                  })
                )}
                disabled={
                  !classe
                }
              />

            </div>

            {classe &&
              elevesListe.length ===
                0 && (
                <p className="mt-2 text-xs text-red-500">
                  Aucun élève trouvé
                  pour cette classe.
                </p>
              )}

          </div>

          <hr className="border-gray-200" />

          {/* =================================================
              ETAPE 3
          ================================================== */}

          <div>

            <SectionHeader
              icon={Calendar}
              stepNum={3}
              title="Période"
            />

            <div className="space-y-3">

              {/* ANNEE */}

              <div>

                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Année scolaire
                </label>

                <input
                  type="text"
                  value={academicYear}
                  readOnly
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-700"
                />

              </div>

              {/* TRIMESTRE */}

              <div>

                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Trimestre
                </label>

                <Select
                  value={trim}
                  onChange={setTrim}
                  options={[
                    "1er Trimestre",
                    "2ème Trimestre",
                    "3ème Trimestre",
                  ]}
                />

              </div>

            </div>

          </div>

          <hr className="border-gray-200" />

          {/* =================================================
              ETAPE 4
          ================================================== */}

          <div>

            <SectionHeader
              icon={ClipboardList}
              stepNum={4}
              title="Notes"
            />

            {!niveau ? (
              <p className="text-xs text-gray-400 italic">
                Choisissez un niveau
                pour voir les
                matières.
              </p>
            ) : !matieres.length ? (
              <p className="text-xs text-red-500">
                Aucune matière trouvée
                dans la base de données.
              </p>
            ) : (
              <div className="space-y-2">

                {matieres.map(
                  (subject) => {
                    const subjectName =
                      subject.name ||
                      subject.nom ||
                      subject.label ||
                      `Matière ${subject.id}`;

                    return (
                      <div
                        key={
                          subject.id ||
                          subjectName
                        }
                        className="grid grid-cols-[1fr_80px] gap-2 items-center"
                      >

                        <span className="text-sm text-gray-700 truncate">
                          {subjectName}
                        </span>

                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          placeholder="/20"
                          value={
                            notes[
                              subjectName
                            ] ?? ""
                          }
                          onChange={(e) =>
                            handleNoteChange(
                              subjectName,
                              e.target.value
                            )
                          }
                          className="border border-gray-300 rounded px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition w-full"
                        />

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </div>

        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="p-5 border-t border-gray-200 space-y-2">

          {saveMsg && (
            <p
              className={`text-xs text-center font-medium ${
                saveMsg.startsWith("⚠")
                  ? "text-red-600"
                  : "text-green-700"
              }`}
            >
              {saveMsg}
            </p>
          )}

          <div className="flex gap-2">

            <button
              onClick={
                handleSave
              }
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition"
            >
              <Save size={14} />

              Enregistrer

            </button>

            <button
              onClick={
                handlePrint
              }
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-500 text-white rounded text-sm font-medium hover:bg-gray-600 transition"
              title="Imprimer"
            >
              <Printer
                size={14}
              />
            </button>

          </div>

        </div>

      </aside>

      {/* =====================================================
          PANNEAU DROIT
      ====================================================== */}

      <main className="flex-1 p-6 overflow-y-auto">

        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Aperçu — Bulletin de notes
        </p>

        {/* BULLETIN */}

        <div
          id="bul-content"
          className="bg-white border border-gray-200 rounded max-w-2xl shadow-sm"
        >

          {!eleve && !niveau ? (

            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">

              <AlertCircle
                size={32}
                className="text-gray-300"
              />

              <p className="text-sm">
                Remplissez le formulaire
                pour générer le
                bulletin.
              </p>

            </div>

          ) : (

            <>

              {/* =================================================
                  HEADER BULLETIN
              ================================================== */}

              <div className="bg-red-600 px-7 py-4 grid grid-cols-3 items-start gap-4">

                <div>

                  <p className="text-red-200 text-[10px] uppercase tracking-widest font-semibold leading-relaxed">

                    {settings?.school_name ||
                      "Établissement Scolaire"}

                    <br />

                    {settings?.school_address ||
                      ""}

                  </p>

                </div>

                <div className="text-center">

                  <h2 className="text-white text-lg font-semibold italic">
                    Bulletin de Notes
                  </h2>

                  <p className="text-red-200 text-xs mt-0.5">
                    {trim} ·{" "}
                    {academicYear ||
                      "—"}
                  </p>

                </div>

                <div className="text-right text-white">

                  <p className="font-semibold text-sm">
                    {eleveNom ||
                      "—"}
                  </p>

                  <p className="text-red-200 text-xs">
                    {classeNom ||
                      "—"}
                  </p>

                  <p className="text-red-300 text-[10px]">
                    {new Date().toLocaleDateString(
                      "fr-FR"
                    )}
                  </p>

                </div>

              </div>

              {/* =================================================
                  META
              ================================================== */}

              <div className="mx-7 mt-5 grid grid-cols-2 gap-3 bg-gray-50 border border-gray-200 rounded p-4">

                {[
                  [
                    "Élève",
                    eleveNom ||
                      "—",
                  ],

                  [
                    "Classe",
                    classeNom ||
                      "—",
                  ],

                  [
                    "Niveau",
                    niveau ||
                      "—",
                  ],

                  [
                    "Période",
                    trim,
                  ],
                ].map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex gap-2 items-baseline"
                    >

                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                        {key} :
                      </span>

                      <span className="text-sm font-semibold text-gray-800">
                        {value}
                      </span>

                    </div>
                  )
                )}

              </div>

              {/* =================================================
                  TABLE NOTES
              ================================================== */}

              <div className="px-7 mt-5">

                <table className="w-full text-sm border-collapse">

                  <thead>

                    <tr className="bg-red-600 text-white">

                      <th className="text-left px-3 py-2.5 text-[10px] uppercase tracking-wider font-medium rounded-tl">
                        Matière
                      </th>

                      <th className="text-center px-3 py-2.5 text-[10px] uppercase tracking-wider font-medium w-20">
                        Note
                      </th>

                      <th className="text-left px-3 py-2.5 text-[10px] uppercase tracking-wider font-medium rounded-tr">
                        Appréciation
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {!matieres.length ? (

                      <tr>

                        <td
                          colSpan={3}
                          className="px-3 py-3 text-gray-400 italic text-xs"
                        >
                          Aucune matière
                          trouvée.
                        </td>

                      </tr>

                    ) : (

                      matieres.map(
                        (
                          subject,
                          index
                        ) => {
                          const subjectName =
                            subject.name ||
                            subject.nom ||
                            subject.label ||
                            `Matière ${subject.id}`;

                          const raw =
                            notes[
                              subjectName
                            ];

                          const n =
                            raw !==
                              undefined &&
                            raw !== "" &&
                            !isNaN(
                              parseFloat(
                                raw
                              )
                            )
                              ? parseFloat(
                                  raw
                                )
                              : null;

                          return (
                            <tr
                              key={
                                subject.id ||
                                subjectName
                              }
                              className={
                                index %
                                  2 ===
                                1
                                  ? "bg-gray-50"
                                  : "bg-white"
                              }
                            >

                              <td className="px-3 py-2 border-b border-gray-100 text-gray-800">
                                {
                                  subjectName
                                }
                              </td>

                              <td className="px-3 py-2 border-b border-gray-100 text-center">

                                {n !==
                                null ? (

                                  <span
                                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getNoteCls(
                                      n
                                    )}`}
                                  >
                                    {n.toFixed(
                                      1
                                    )}
                                  </span>

                                ) : (

                                  <span className="text-gray-300 text-xs">
                                    —
                                  </span>

                                )}

                              </td>

                              <td className="px-3 py-2 border-b border-gray-100 text-xs text-gray-500 italic">

                                {n !==
                                null
                                  ? getApprMatiere(
                                      n
                                    )
                                  : ""}

                              </td>

                            </tr>
                          );
                        }
                      )

                    )}

                  </tbody>

                </table>

              </div>

              {/* =================================================
                  FOOTER BULLETIN
              ================================================== */}

              <div className="mx-7 mt-5 mb-6 grid grid-cols-[1fr_auto] gap-4 pt-4 border-t-2 border-red-600 items-end">

                <div>

                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Appréciation générale
                  </p>

                  <p className="text-sm italic text-gray-700 leading-relaxed">
                    {getApprGen(
                      avg
                    )}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Moyenne
                  </p>

                  <p className="text-4xl font-light text-red-600 leading-none">

                    {avg !==
                    null
                      ? avg.toFixed(
                          2
                        )
                      : "—"}

                    <span className="text-base opacity-40 ml-0.5">
                      /20
                    </span>

                  </p>

                  <span
                    className={`inline-block mt-1.5 px-3 py-0.5 rounded text-xs font-semibold ${mention.cls}`}
                  >
                    {
                      mention.t
                    }
                  </span>

                </div>

              </div>

              {/* =================================================
                  SIGNATURES
              ================================================== */}

              <div className="mx-7 mb-7 grid grid-cols-2 gap-6">

                {[
                  "Signature du responsable légal",
                  "Cachet et signature du directeur",
                ].map(
                  (text) => (
                    <div
                      key={text}
                      className="border-t border-gray-200 pt-2 text-center text-[10px] text-gray-400"
                    >
                      {text}
                    </div>
                  )
                )}

              </div>

            </>

          )}

        </div>

        {/* IMPRESSION */}

        <button
          onClick={
            handlePrint
          }
          className="mt-4 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition"
        >
          <Printer
            size={14}
          />

          Imprimer / Enregistrer
          en PDF

        </button>

      </main>

    </div>
  );
}
