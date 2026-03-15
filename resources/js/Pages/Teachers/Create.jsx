import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { createTeacherApi } from "../../api/apiTeachers";
import { toast } from "react-hot-toast";
import { Save, X } from "lucide-react";

export default function CreateTeacher() {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const [teacher, setTeacher] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subject: "",
    birth_date: "",
    salary: "",
    photo: null,
  });

  // Classe input dynamique
  const inputClassName = (field) =>
    `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  const renderError = (field) =>
    errors[field] ? (
      <p className="mt-1 text-sm text-red-600">{errors[field][0]}</p>
    ) : null;

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0];
      setTeacher({ ...teacher, photo: file });

      if (file) setPreview(URL.createObjectURL(file));
      else setPreview(null);
    } else {
      setTeacher({ ...teacher, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(teacher).forEach((key) => {
        if (teacher[key] !== null) {
          formData.append(key, teacher[key]);
        }
      });

      await createTeacherApi(formData, token);

      toast.success("Enseignant enregistré avec succès ✅");
      navigate("/teachers");

    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      toast.error("Erreur lors de l'enregistrement ❌");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">

        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Ajouter un Enseignant
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Photo */}
            <div className="lg:w-1/4 flex flex-col items-center">

              <div className="w-32 h-32 rounded-full border-4 border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden mb-4">
                {preview ? (
                  <img
                    src={preview}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>

              <label className="cursor-pointer">
                <div className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200 text-sm font-medium text-center shadow-md">
                  Sélectionner une image
                </div>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>
              {renderError("photo")}
            </div>

            {/* Infos */}
            <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  name="first_name"
                  value={teacher.first_name}
                  onChange={handleChange}
                  className={inputClassName("first_name")}
                />
                {renderError("first_name")}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  name="last_name"
                  value={teacher.last_name}
                  onChange={handleChange}
                  className={inputClassName("last_name")}
                />
                {renderError("last_name")}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={teacher.email}
                  onChange={handleChange}
                  className={inputClassName("email")}
                />
                {renderError("email")}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  name="phone"
                  value={teacher.phone}
                  onChange={handleChange}
                  className={inputClassName("phone")}
                />
                {renderError("phone")}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matière
                </label>
                <input
                  name="subject"
                  value={teacher.subject}
                  onChange={handleChange}
                  className={inputClassName("subject")}
                />
                {renderError("subject")}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={teacher.birth_date}
                  onChange={handleChange}
                  className={inputClassName("birth_date")}
                />
                {renderError("birth_date")}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salaire (MGA)
                </label>
                <input
                  type="number"
                  name="salary"
                  value={teacher.salary}
                  onChange={handleChange}
                  className={inputClassName("salary")}
                />
                {renderError("salary")}
              </div>

            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-4 mt-10 border-t pt-6">

            <button
              type="button"
              onClick={() => navigate("/teachers")}
              className="px-6 py-3 bg-gray-400 text-white rounded-lg flex items-center gap-2 hover:bg-gray-500 transition"
            >
              <X size={18} /> Annuler
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition shadow-md"
            >
              <Save size={18} /> Enregistrer
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
