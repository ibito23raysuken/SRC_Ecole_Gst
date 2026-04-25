import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { createSchoolClassApi, getAllSchoolClassesApi } from "../../api/apiSchoolClasses";
import { getAcademicYearsApi } from "../../api/academicYearApi";
import { toast } from "react-hot-toast";
import { Save, X, AlertTriangle, Calendar } from "lucide-react";

export default function CreateSchoolClass() {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [academicYear, setAcademicYear] = useState(null);
  const [classes, setClasses] = useState([]);
  const [errors, setErrors] = useState({});
  const [noParamModal, setNoParamModal] = useState(false);

  const [schoolClass, setSchoolClass] = useState({
    name: "",
    level: "",
    capacity: 30,
    academic_year_id: ""
  });

  const levels = [
    "PS","MS","GS","CP","CE1","CE2","CM1","CM2",
    "6e","5e","4e","3e","2nde","1ère","Term"
  ];

  const generateClassName = (level) => {
    if (!level) return "";
    const sameLevel = classes.filter(c => c.level === level);
    if (sameLevel.length === 0) return `${level}_A`;
    const letters = sameLevel.map(c => (c.name.split("_")[1] || "A"));
    letters.sort();
    const lastLetter = letters[letters.length - 1];
    const nextLetter = String.fromCharCode(lastLetter.charCodeAt(0) + 1);
    return `${level}_${nextLetter}`;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getAcademicYearsApi(token);
        if (!data || !data.id) {
          setNoParamModal(true);
          return;
        }
        setAcademicYear(data);
        setSchoolClass(prev => ({ ...prev, academic_year_id: data.id }));
        const allClasses = await getAllSchoolClassesApi(token);
        setClasses(allClasses || []);
      } catch (error) {
        console.error(error);
        toast.error("Impossible de charger l'année académique ❌");
        setNoParamModal(true);
      }
    };
    fetchSettings();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchoolClass(prev => {
      const updated = { ...prev, [name]: name === "capacity" ? Number(value) : value };
      if (name === "level") updated.name = generateClassName(value);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!schoolClass.academic_year_id) {
      toast.error("Aucune année académique définie ❌");
      return;
    }
    if (noParamModal) return;
    try {
      await createSchoolClassApi(schoolClass, token);
      toast.success("Classe créée avec succès ✅");
      navigate("/SchoolClass/list");
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      toast.error("Erreur lors de l'enregistrement ❌");
    }
  };

  const inputClassName = (field) =>
    `w-full px-4 py-3 border rounded-xl transition ${
      errors[field] ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-red-200"
    } focus:outline-none focus:ring-2`;

  const renderError = (field) =>
    errors[field] && <p className="text-red-600 text-sm mt-1">{errors[field][0]}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto relative">

      {/* MODAL SI PAS D’ANNÉE */}
      {noParamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center relative">
            <X
              className="w-6 h-6 text-gray-500 absolute top-4 right-4 cursor-pointer hover:text-gray-800"
              onClick={() => navigate("/")}
            />
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
              <h2 className="text-xl font-bold text-red-600">
                Année académique non paramétrée
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Vous devez configurer l'année académique avant de créer une classe.
            </p>
            <button
              onClick={() => navigate("/parametre")}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              Paramétrer maintenant
            </button>
          </div>
        </div>
      )}

      {/* FORMULAIRE */}
      <div className={`${noParamModal ? "opacity-50 pointer-events-none" : ""} bg-white p-8 rounded-2xl shadow-lg`}>

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-red-700">Ajouter une Classe</h2>

          {academicYear && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
              <Calendar size={18} className="text-red-600" />
              <span className="text-sm text-gray-600">Année :</span>
              <span className="font-bold text-red-700">
                {academicYear.academic_year}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">

          <div>
            <label className="font-medium">Niveau *</label>
            <select
              name="level"
              value={schoolClass.level}
              onChange={handleChange}
              disabled={noParamModal}
              className={inputClassName("level")}
            >
              <option value="">-- Sélectionner un niveau --</option>
              {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
            </select>
            {renderError("level")}
          </div>

          <div>
            <label className="font-medium">Nom de la classe *</label>
            <input
              name="name"
              value={schoolClass.name}
              readOnly
              className={`${inputClassName("name")} bg-gray-100 cursor-not-allowed`}
            />
            {renderError("name")}
          </div>

          <div>
            <label className="font-medium">Capacité</label>
            <input
              type="number"
              name="capacity"
              value={schoolClass.capacity}
              onChange={handleChange}
              className={inputClassName("capacity")}
            />
            {renderError("capacity")}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate("/SchoolClass/list")}
              className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-xl hover:bg-gray-500"
            >
              <X size={18} /> Annuler
            </button>

            <button
              type="submit"
              disabled={noParamModal}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white ${
                noParamModal
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <Save size={18} /> Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
