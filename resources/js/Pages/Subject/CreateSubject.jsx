import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { createSubjectApi } from "../../api/apiSubjects";
import { getAllSchoolClassesApi } from "../../api/apiSchoolClasses";
import { toast } from "react-hot-toast";
import { Save, X } from "lucide-react";

export default function CreateSubject() {

  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);

  const [subject, setSubject] = useState({
    name: "",
    coefficient: 1,
    class_id: ""
  });

  const inputClassName = (field) =>
    `w-full px-4 py-2 border rounded-lg ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  const renderError = (field) =>
    errors[field] ? (
      <p className="text-red-600 text-sm">{errors[field][0]}</p>
    ) : null;

  // 🔥 Charger les classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);

        if (!token) throw new Error("Token manquant !");

        const data = await getAllSchoolClassesApi(token);

        // compatible API Laravel ou autre
        setClasses(data.data || data);

        setErrors({});

      } catch (err) {
        console.error("Erreur de chargement :", err);

        setErrors({
          class_id: [
            err.response?.data?.message ||
            err.message ||
            "Erreur lors du chargement des classes"
          ]
        });

      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSubject((prev) => ({
      ...prev,
      [name]: name === "coefficient"
        ? (value === "" ? "" : Number(value))
        : value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.name.trim()) {
      setErrors({ name: ["Le nom est obligatoire"] });
      return;
    }

    if (!subject.class_id) {
      setErrors({ class_id: ["La classe est obligatoire"] });
      return;
    }

    if (classes.length === 0) {
      toast.error("Aucune classe disponible ❌");
      return;
    }

    setLoading(true);

    try {

      await createSubjectApi({
        name: subject.name,
        coefficient: subject.coefficient,
        class_id: subject.class_id
      }, token);

      toast.success("Matière créée avec succès ✅");

      navigate("/subjects/Liste_Subject");

    } catch (error) {

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      toast.error("Erreur lors de la création ❌");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <div className="bg-white p-8 rounded-2xl shadow-lg border">

        <h2 className="text-2xl font-bold mb-6 border-b pb-2">
          Ajouter une matière
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-6">

          {/* NOM */}
          <div>
            <label className="block mb-1 font-medium">
              Nom de la matière *
            </label>

            <input
              name="name"
              value={subject.name}
              onChange={handleChange}
              className={inputClassName("name")}
              required
            />
            {renderError("name")}
          </div>

          {/* COEFFICIENT */}
          <div>
            <label className="block mb-1 font-medium">
              Coefficient
            </label>

            <input
              type="number"
              name="coefficient"
              value={subject.coefficient}
              onChange={handleChange}
              className={inputClassName("coefficient")}
              min="1"
              max="10"
            />
            {renderError("coefficient")}
          </div>

          {/* CLASSE */}
          <div>
            <label className="block mb-1 font-medium">
              Classe *
            </label>

            <select
              name="class_id"
              value={subject.class_id}
              onChange={handleChange}
              className={inputClassName("class_id")}
              disabled={loading}
            >
              <option value="">
                {loading ? "Chargement..." : "-- Choisir une classe --"}
              </option>

              {classes.length === 0 && (
                <option disabled>Aucune classe disponible</option>
              )}

              {classes.map((classe) => (
                <option key={classe.id} value={classe.id}>
                  {classe.name}
                </option>
              ))}
            </select>

            {renderError("class_id")}
          </div>

          {/* BOUTONS */}
          <div className="flex justify-end gap-4 pt-4 border-t">

            <button
              type="button"
              onClick={() => navigate("/subjects")}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg flex items-center gap-2 hover:bg-gray-500"
            >
              <X size={18}/> Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-white rounded-lg flex items-center gap-2
                ${loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"}`}
            >
              <Save size={18}/>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
