// resources/js/pages/StudentCreate.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { createStudentApi } from "../../api/apiStudents";
import { toast } from "react-hot-toast";
import { Save, X } from "lucide-react";

// Sections
import PersonalInfoSection from "../../component/Create/PersonalInfoSection";
import ContactSection from "../../component/Create/ContactSection";
import AcademicInfoSection from "../../component/Create/AcademicInfoSection";
import NotesSection from "../../component/Create/NotesSection";
import DocumentsSection from "../../component/Create/DocumentsSection";
import GuardianSection from "../../component/Create/GuardianSection";
import TuitionPayment from "../../component/Create/TuitionPayment";

// Validation FRONT
import { validateStudent } from "../../component/outils/validateStudent";

export default function StudentCreate() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    birthPlace: "",
    gender: "male",
    nationality: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    previousSchool: "",
    previousClass: "",
    academicYear: new Date().getFullYear().toString(),
    gradeLevel: "",
    specialNeeds: "",
    birthCertificate: false,
    medicalCertificate: false,
    reportCard: false,
    idCard: false,
    tuitionPayment: {
        registration_status: "not_paid",
        tuition_status: "not_paid",
        paid_months: [],
        },
    registrationMonths: [],
    studentImage: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setStudent({
      ...student,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation front
  const validationErrors = validateStudent(student);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    toast.error(Object.values(validationErrors)[0][0]);
    return;
  }

  try {
    const formData = new FormData();

    Object.keys(student).forEach((key) => {
      if (key === "registrationMonths") {
        // Envoyer chaque mois séparément
        student[key].forEach((month) => {
          formData.append("registrationMonths[]", month);
        });
      } else if (key === "studentImage") {
        if (student[key]) formData.append("studentImage", student[key]);
      } else if (key === "tuitionPayment") {
        // ✅ STRINGIFY pour JSON
        formData.append("tuitionPayment", JSON.stringify(student[key]));
      } else if (key === "parents") {
        formData.append("parents", JSON.stringify(student[key] || []));
      } else if (
        key === "birthCertificate" ||
        key === "medicalCertificate" ||
        key === "reportCard" ||
        key === "idCard"
      ) {
        // créer un objet dossier et stringify
        const dossier = {
          birthCertificate: student.birthCertificate,
          medicalCertificate: student.medicalCertificate,
          reportCard: student.reportCard,
          idCard: student.idCard,
        };
        formData.append("dossier", JSON.stringify(dossier));
      } else {
        formData.append(key, student[key] || "");
      }
    });

    // Debug : vérifier ce qui est envoyé
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    await createStudentApi(formData, token);

    toast.success("Étudiant créé avec succès !");
    navigate("/students");
  } catch (error) {
    if (error.errors) {
      setErrors(error.errors);
      toast.error(Object.values(error.errors)[0][0]);
    } else {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    }
  }
};


  return (
    <div className="flex">
      <div className="w-64 min-h-screen">{/* Sidebar */}</div>

      <div className="flex-1 min-h-screen p-4 lg:p-6">
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">

          <PersonalInfoSection student={student} handleChange={handleChange} errors={errors} />
          <ContactSection student={student} handleChange={handleChange} errors={errors} />
          <AcademicInfoSection student={student} handleChange={handleChange} errors={errors} />
          <GuardianSection student={student} handleChange={handleChange} errors={errors} />
          <NotesSection student={student} handleChange={handleChange} errors={errors} />
          <DocumentsSection student={student} handleChange={handleChange} errors={errors} />
          <TuitionPayment student={student} handleChange={handleChange} errors={errors} />

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button type="button" onClick={() => navigate("/students")}
              className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              <X className="w-4 h-4" /> Annuler
            </button>
            <button type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
              <Save className="w-4 h-4" /> Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
