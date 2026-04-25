import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { createTeacherApi } from "../../api/apiTeachers";
import { getSubjectsApi } from "../../api/apiSubjects";
import { getAllSchoolClassesApi } from "../../api/apiSchoolClasses";
import { toast } from "react-hot-toast";
import { Save, X } from "lucide-react";

export default function CreateTeacher() {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [noClassMessage, setNoClassMessage] = useState(false);
  const [noSubjectMessage, setNoSubjectMessage] = useState(false);

  const levels = [
    "PS","MS","GS","CP","CE1","CE2","CM1","CM2",
    "6e","5e","4e","3e","2nde","1ère","Term"
  ];

  const secondaryLevels = [
    "6e","5e","4e","3e","2nde","1ère","Term"
  ];

  const [teacher, setTeacher] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country_code: "+261",
    phone: "",
    level: "",
    current_class: "",
    subject: "",
    birth_date: "",
    salary: "",
    photo: null,
  });

  const isSecondary = secondaryLevels.includes(teacher.level);

  const inputClassName = (field) =>
    `w-full px-4 py-3 rounded-xl bg-gray-50 border ${
      errors[field] ? "border-red-500" : "border-gray-200"
    } focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all`;

  // ⚡ Fetch toutes les classes et matières
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allClasses = await getAllSchoolClassesApi(token);
        setClasses(allClasses || []);

        const allSubjects = await getSubjectsApi(token);
        setSubjects(allSubjects || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  // ⚡ Mettre à jour classes et matières disponibles quand niveau change
  useEffect(() => {
    if (!teacher.level) {
      setAvailableClasses([]);
      setAvailableSubjects([]);
      setNoClassMessage(false);
      setNoSubjectMessage(false);
      setTeacher(prev => ({ ...prev, current_class: "", subject: "" }));
      return;
    }

    // Classes disponibles pour ce niveau
    const filteredClasses = classes.filter(c => c.level === teacher.level);
    if (filteredClasses.length > 0) {
      setAvailableClasses(filteredClasses);
      setNoClassMessage(false);
      setTeacher(prev => ({ ...prev, current_class: "" }));
    } else {
      setAvailableClasses([]);
      setNoClassMessage(true);
      setTeacher(prev => ({ ...prev, current_class: "" }));
    }

    // Matières disponibles pour secondaire
    if (isSecondary) {
      const filteredSubjects = subjects.filter(s => s.level === teacher.level);
      if (filteredSubjects.length > 0) {
        setAvailableSubjects(filteredSubjects);
        setNoSubjectMessage(false);
        setTeacher(prev => ({ ...prev, subject: "" }));
      } else {
        setAvailableSubjects([]);
        setNoSubjectMessage(true);
        setTeacher(prev => ({ ...prev, subject: "" }));
      }
    } else {
      setAvailableSubjects([]);
      setNoSubjectMessage(false);
      setTeacher(prev => ({ ...prev, subject: "" }));
    }
  }, [teacher.level, classes, subjects, isSecondary]);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0];
      setTeacher({ ...teacher, photo: file });
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      const { name, value } = e.target;
      setTeacher(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(teacher).forEach(key => {
        if (teacher[key]) formData.append(key, teacher[key]);
      });
      await createTeacherApi(formData, token);
      toast.success("Enseignant ajouté ✅");
      navigate("/teachers");
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      toast.error("Erreur ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Nouvel Enseignant</h1>
          <p className="text-gray-500 text-sm">Ajouter un professeur au système</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">

            {/* PHOTO CARD */}
            <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden mb-4">
                {preview ? <img src={preview} className="w-full h-full object-cover"/>
                  : <div className="flex items-center justify-center h-full text-gray-400 text-sm">Photo</div>}
              </div>
              <label className="text-sm text-red-600 cursor-pointer hover:underline">
                Changer la photo
                <input type="file" name="photo" className="hidden" onChange={handleChange}/>
              </label>
            </div>

            {/* FORM CARD */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <input placeholder="Prénom" name="first_name" value={teacher.first_name} onChange={handleChange} className={inputClassName("first_name")}/>
                <input placeholder="Nom" name="last_name" value={teacher.last_name} onChange={handleChange} className={inputClassName("last_name")}/>
                <input type="email" placeholder="Email" name="email" value={teacher.email} onChange={handleChange} className={inputClassName("email")}/>

                {/* TELEPHONE avec code pays */}
                <div className="flex gap-2 md:col-span-2">
                  <select
                    name="country_code"
                    value={teacher.country_code || "+261"}
                    onChange={(e) => setTeacher(prev => ({ ...prev, country_code: e.target.value }))}
                    className="px-2 py-2 border rounded-xl w-28"
                  >
                    <option value="+261">+261 (MG)</option>
                    <option value="+33">+33 (FR)</option>
                    <option value="+1">+1 (US)</option>
                  </select>

                  <input
                    type="tel"
                    name="phone"
                    value={teacher.phone}
                    placeholder="XX-XX-XXX-XX"
                    onChange={(e) => setTeacher(prev => ({ ...prev, phone: e.target.value }))}
                    className={inputClassName("phone") + " flex-1"}
                  />
                </div>

                {/* NIVEAU */}
                <select name="level" value={teacher.level} onChange={handleChange} className={`${inputClassName("level")} md:col-span-2`}>
                  <option value="">Choisir un niveau</option>
                  {Array.from(new Set(classes.map(c => c.level))).map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>

                {/* CLASSE */}
                {teacher.level && (
                  noClassMessage ? (
                    <div className="md:col-span-2 p-3 border rounded-lg bg-yellow-50 text-yellow-700 font-medium">
                      Aucune classe disponible pour ce niveau. Veuillez créer une classe
                    </div>
                  ) : (
                    <select name="current_class" value={teacher.current_class} onChange={handleChange} className={`${inputClassName("current_class")} md:col-span-2`}>
                      <option value="">Choisir une classe</option>
                      {availableClasses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  )
                )}

                {/* MATIÈRE (secondaire seulement) */}
                {isSecondary && (
                  noSubjectMessage ? (
                    <div className="md:col-span-2 p-3 border rounded-lg bg-yellow-50 text-yellow-700 font-medium">
                      Aucune matière disponible pour ce niveau. Veuillez ajouter une matière
                      <button
                        type="button"
                        className="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => navigate("/subjects/create")}
                      >
                        Créer une matière
                      </button>
                    </div>
                  ) : (
                    <select name="subject" value={teacher.subject} onChange={handleChange} className={`${inputClassName("subject")} md:col-span-2`}>
                      <option value="">Choisir une matière</option>
                      {availableSubjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  )
                )}

                <input type="date" name="birth_date" value={teacher.birth_date} onChange={handleChange} className={inputClassName("birth_date")}/>
                <input type="number" placeholder="Salaire" name="salary" value={teacher.salary} onChange={handleChange} className={inputClassName("salary")}/>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={() => navigate("/teachers")} className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center gap-2">
              <X size={16}/> Annuler
            </button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white shadow hover:scale-105 transition flex items-center gap-2">
              <Save size={16}/> Enregistrer
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
