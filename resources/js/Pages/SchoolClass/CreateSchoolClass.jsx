import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { createSchoolClassApi } from "../../api/apiSchoolClasses";
import { getAcademicYearsApi } from "../../api/academicYearApi";
import { toast } from "react-hot-toast";
import { Save, X } from "lucide-react";

export default function CreateSchoolClass() {

  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [academicYears, setAcademicYears] = useState([]);
  const [errors, setErrors] = useState({});

  const [schoolClass, setSchoolClass] = useState({
    name: "",
    level: "",
    capacity: 30,
    academic_year_id: ""
  });

  const levels = [
    "PS","MS","GS",
    "CP","CE1","CE2",
    "CM1","CM2",
    "6e","5e","4e","3e",
    "2nde","1ère","Term"
  ];

  const inputClassName = (field) =>
    `w-full px-4 py-3 border rounded-lg ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  const renderError = (field) =>
    errors[field] ? (
      <p className="text-red-600 text-sm">{errors[field][0]}</p>
    ) : null;

  useEffect(() => {

    const fetchSettings = async () => {

      try {
        const data = await getAcademicYearsApi(token);
        // transformer en tableau
        setAcademicYears([
          {
            id: data.id,
            name: data.academic_year
          }
        ]);

        setSchoolClass((prev) => ({
          ...prev,
          academic_year_id: data.id
        }));

      } catch (error) {

        toast.error("Impossible de charger l'année académique ❌");

      }

    };

    fetchSettings();

  }, [token]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setSchoolClass({
      ...schoolClass,
      [name]: name === "capacity" ? Number(value) : value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createSchoolClassApi(schoolClass, token);

      toast.success("Classe créée avec succès ✅");

      navigate("/SchoolClass/list");

    } catch (error) {

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      toast.error("Erreur lors de l'enregistrement ❌");

    }

  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <div className="bg-white p-8 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-bold mb-6">
          Ajouter une Classe
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-6">

          <div>
            <label>Nom de la classe *</label>
            <input
              name="name"
              value={schoolClass.name}
              onChange={handleChange}
              className={inputClassName("name")}
            />
            {renderError("name")}
          </div>

          <div>
            <label>Niveau</label>
            <select
              name="level"
              value={schoolClass.level}
              onChange={handleChange}
              className={inputClassName("level")}
            >
              <option value="">-- Niveau --</option>

              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}

            </select>
            {renderError("level")}
          </div>

          <div>
            <label>Capacité</label>
            <input
              type="number"
              name="capacity"
              value={schoolClass.capacity}
              onChange={handleChange}
              className={inputClassName("capacity")}
            />
            {renderError("capacity")}
          </div>

          <div>
            <label>Année académique</label>
            <select
              name="academic_year_id"
              value={schoolClass.academic_year_id}
              onChange={handleChange}
              className={inputClassName("academic_year_id")}
            >

              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}

            </select>
          </div>

          <div className="flex gap-4">

            <button
              type="button"
              onClick={() => navigate("/classes")}
              className="bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <X size={18} /> Annuler
            </button>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Save size={18} /> Enregistrer
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
