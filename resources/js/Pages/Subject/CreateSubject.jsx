import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { createSubjectApi } from "../../api/apiSubjects";
import { toast } from "react-hot-toast";
import { Save, X } from "lucide-react";

export default function CreateSubject() {

  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [errors, setErrors] = useState({});
  const [subject, setSubject] = useState({
    name: "",
    code: "",
    coefficient: 1
  });

  const inputClassName = (field) =>
    `w-full px-4 py-2 border rounded-lg ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  const renderError = (field) =>
    errors[field] ? (
      <p className="text-red-600 text-sm">{errors[field][0]}</p>
    ) : null;

  const handleChange = (e) => {

    const { name, value } = e.target;

    setSubject({
      ...subject,
      [name]: name === "coefficient" ? Number(value) : value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createSubjectApi(subject, token);

      toast.success("Matière créée avec succès ✅");

      navigate("/subjects");

    } catch (error) {

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      toast.error("Erreur lors de la création ❌");

    }

  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <div className="bg-white p-8 rounded-2xl shadow-lg border">

        <h2 className="text-2xl font-bold mb-6 border-b pb-2">
          Ajouter une matière
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-6">

          <div>
            <label className="block mb-1 font-medium">
              Nom de la matière *
            </label>

            <input
              name="name"
              value={subject.name}
              onChange={handleChange}
              className={inputClassName("name")}
            />

            {renderError("name")}
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Code matière
            </label>

            <input
              name="code"
              value={subject.code}
              onChange={handleChange}
              className={inputClassName("code")}
              placeholder="ex: MATH"
            />

            {renderError("code")}
          </div>

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
              className="px-6 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Save size={18}/> Enregistrer
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
