import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { createStudentApi } from "../../api/apiStudents";
import { toast } from "react-hot-toast";
import { Save, X } from "lucide-react";

import PersonalInfoSection from "../../component/Create/PersonalInfoSection";
import ContactSection from "../../component/Create/ContactSection";
import AcademicInfoSection from "../../component/Create/AcademicInfoSection";
import NotesSection from "../../component/Create/NotesSection";
import DocumentsSection from "../../component/Create/DocumentsSection";
import GuardianSection from "../../component/Create/GuardianSection";
import TuitionPayment from "../../component/Create/TuitionPayment";

import { validateStudent } from "../../component/outils/validateStudent";

export default function StudentCreate() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    birth_place: "",
    gender: "male",
    nationality: "",
    address: "",
    city: "",
    postal_code: "",
    phone: "",
    previous_school: "",
    previous_class: "",
    academic_year: new Date().getFullYear().toString(),
    grade_level: "",
    special_needs: "",

    birth_certificate: false,
    medical_certificate: false,
    report_card: false,
    id_card: false,

    registration_status: "not_paid",
    paid_months: [],

    student_image: null,

    parents: [],
    guardians_data: {} // 🔥 important
  });

  const [errors, setErrors] = useState({});

  // 🔹 Gestion globale des changements
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name.startsWith("guardian_")) {
      setStudent(prev => ({
        ...prev,
        guardians_data: {
          ...prev.guardians_data,
          [name]:
            type === "checkbox"
              ? checked
              : type === "file"
              ? files[0]
              : value
        }
      }));
    } else {
      setStudent(prev => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "file"
            ? files[0]
            : value
      }));
    }
  };

  // 🔹 Submit
// 🔹 Submit
const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validateStudent(student);

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    toast.error(Object.values(validationErrors)[0][0]);
    return;
  }

  try {
    const formData = new FormData();

    // 1️⃣ Champs simples
    [
      "first_name", "last_name", "birth_date", "birth_place",
      "gender", "nationality", "address", "city", "postal_code",
      "phone", "previous_school", "previous_class",
      "academic_year", "grade_level", "special_needs"
    ].forEach(field =>
      formData.append(field, student[field] ?? "")
    );

    // 2️⃣ Documents
    formData.append("birth_certificate", student.birth_certificate ? 1 : 0);
    formData.append("medical_certificate", student.medical_certificate ? 1 : 0);
    formData.append("report_card", student.report_card ? 1 : 0);
    formData.append("id_card", student.id_card ? 1 : 0);

    // 3️⃣ Image
    if (student.student_image instanceof File) {
      formData.append("profile_photo", student.student_image);
    }

    // 4️⃣ Paiement
    formData.append("registration_status", student.registration_status);

    student.paid_months.forEach((month, index) => {
      formData.append(`paid_months[${index}]`, month);
    });

    // 5️⃣ 🔥 TRANSFORMER guardians_data → parents[]
    const grouped = {};
    Object.keys(student.guardians_data || {}).forEach((key) => {
      const match = key.match(/^guardian_(\d+)_(.+)$/);
      if (match) {
        const id = match[1];
        const field = match[2];
        if (!grouped[id]) grouped[id] = {};
        grouped[id][field] = student.guardians_data[key];
      }
    });
    const parentsArray = Object.values(grouped).filter(g => g.name && g.name.trim() !== "");
    formData.append("parents", JSON.stringify(parentsArray));

    await createStudentApi(formData, token);

    // ✅ Succès
    toast.success("Étudiant créé avec succès !");
    navigate("/students");

  } catch (error) {
    // ⚠️ Gestion des erreurs
    if (error.response) {
      // Erreur de validation côté serveur
      const status = error.response.status;
      const data = error.response.data;

      if (status === 409) {
        // Étudiant avec le même prénom+nom existe déjà
        toast.error(data.message || "Un étudiant avec ce nom et prénom existe déjà.");
      } else if (data.errors) {
        setErrors(data.errors);
        toast.error(Object.values(data.errors)[0][0]);
      } else {
        toast.error("Erreur lors de l'enregistrement");
      }
    } else {
      toast.error("Erreur réseau ou serveur indisponible");
    }
  }
};


  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <form onSubmit={handleSubmit} className="space-y-8">

          <PersonalInfoSection
            student={student}
            handleChange={handleChange}
            errors={errors}
          />

          <ContactSection
            student={student}
            handleChange={handleChange}
            setStudent={setStudent}
            errors={errors}
          />

          <AcademicInfoSection
            student={student}
            handleChange={handleChange}
            setStudent={setStudent}  // ✅ IMPORTANT
            errors={errors}
          />

          <GuardianSection
            student={student}
            handleChange={handleChange}
            errors={errors}
            setStudent={setStudent}
        />


          <NotesSection
            student={student}
            handleChange={handleChange}
            errors={errors}
          />

          <DocumentsSection
            student={student}
            handleChange={handleChange}
            errors={errors}
          />

          <TuitionPayment
            student={student}
            setStudent={setStudent}
            errors={errors}
          />

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/students")}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg"
            >
              <X className="w-4 h-4 inline" /> Annuler
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-red-600 text-white rounded-lg"
            >
              <Save className="w-4 h-4 inline" /> Enregistrer
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
