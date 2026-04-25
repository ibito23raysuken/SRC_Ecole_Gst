import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { toast } from "react-hot-toast";

import { createStudentApi } from "../../api/apistudents";
import { getAllSchoolClassesApi } from "../../api/apiSchoolClasses";

import PersonalInfoSection from "../../component/Create/PersonalInfoSection";
import ContactSection from "../../component/Create/ContactSection";
import AcademicInfoSection from "../../component/Create/AcademicInfoSection";
import GuardianSection from "../../component/Create/GuardianSection";
import NotesSection from "../../component/Create/NotesSection";
import DocumentsSection from "../../component/Create/DocumentsSection";
import TuitionPayment from "../../component/Create/TuitionPayment";

import { Save, X, Plus, AlertTriangle } from "lucide-react";

export default function StudentCreate() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  // ✅ STATE ALIGNÉ LARAVEL
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
    academic_year: String(new Date().getFullYear()),
    school_class_id: null,
    grade_level: "",
    special_needs: "",

    birth_certificate: false,
    medical_certificate: false,
    residence_certificate: false,
    report_card: false,

    student_image: null,

    registration_status: "not_paid",
    paid_months: [],

    parents: [],
    guardians_data: {}
  });

  const [errors, setErrors] = useState({});
  const [noClassModal, setNoClassModal] = useState(false);

  // 🔥 SIMPLE VALIDATION (évite crash)
  const validateStudent = (data) => {
    const errors = {};

    if (!data.first_name?.trim()) errors.first_name = ["Prénom requis"];
    if (!data.last_name?.trim()) errors.last_name = ["Nom requis"];
    if (!data.birth_date) errors.birth_date = ["Date de naissance requise"];
    if (!data.gender) errors.gender = ["Genre requis"];
    if (!data.phone?.trim()) errors.phone = ["Téléphone requis"];
    if (!data.registration_status) errors.registration_status = ["Statut d'inscription requis"];
    if (!data.school_class_id) errors.school_class_id = ["Classe requise"];

    return errors;
  };

  // 🔹 CHECK CLASSES
  useEffect(() => {
    const checkClasses = async () => {
      try {
        const classes = await getAllSchoolClassesApi(token);

        if (!classes || classes.length === 0) {
          setNoClassModal(true);
        }
      } catch (error) {
        console.error("Erreur classes:", error);
      }
    };

    checkClasses();
  }, [token]);

  // 🔹 HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "school_class_id") {
      setStudent((prev) => ({
        ...prev,
        school_class_id: value ? Number(value) : null
      }));
      return;
    }

    if (name.startsWith("guardian_")) {
      setStudent((prev) => ({
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
      return;
    }

    setStudent((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value
    }));
  };

  // 🔹 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (noClassModal) {
      toast.error("Veuillez créer une classe d'abord");
      return;
    }

    const validationErrors = validateStudent(student);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(Object.values(validationErrors)[0][0]);
      return;
    }

    try {
      const formData = new FormData();

      const fields = [
        "first_name",
        "last_name",
        "birth_date",
        "birth_place",
        "gender",
        "nationality",
        "address",
        "city",
        "postal_code",
        "phone",
        "previous_school",
        "previous_class",
        "academic_year",
        "grade_level",
        "special_needs",
        "school_class_id"
      ];

      fields.forEach((field) => {
        if (field === "school_class_id") {
          // Handle school_class_id specifically - don't append if null
          if (student[field] !== null && student[field] !== undefined) {
            formData.append(field, student[field]);
          }
        } else {
          formData.append(field, student[field] ?? "");
        }
      });

      // documents
      formData.append("birth_certificate", student.birth_certificate ? 1 : 0);
      formData.append("medical_certificate", student.medical_certificate ? 1 : 0);
      formData.append("residence_certificate", student.residence_certificate ? 1 : 0);
      formData.append("report_card", student.report_card ? 1 : 0);

      // image
      if (student.student_image instanceof File) {
        formData.append("student_image", student.student_image);
      }

      // paiement
      formData.append("registration_status", student.registration_status);

      // mois payés
      if (Array.isArray(student.paid_months) && student.paid_months.length > 0) {
        student.paid_months.forEach((month) => {
          formData.append("paid_months[]", month);
        });
      }

      // parents JSON (temporaire)
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

      const parentsArray = Object.values(grouped).filter(
        (g) => g.name && g.name.trim() !== ""
      );

      formData.append("parents", JSON.stringify(parentsArray));

      await createStudentApi(formData, token);

      toast.success("Étudiant créé avec succès !");
      navigate("/students");

    } catch (error) {
      console.error(error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error(Object.values(error.response.data.errors)[0][0]);
      } else {
        toast.error("Erreur lors de l'enregistrement");
      }
    }
  };

  return (
    <div className="flex relative">

      {/* MODAL */}
      {noClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

          <div className="bg-white p-8 rounded-xl text-center w-full max-w-md relative">

            <X
              className="absolute top-3 right-3 cursor-pointer"
              onClick={() => navigate("/students")}
            />

            <AlertTriangle className="text-yellow-500 w-10 h-10 mx-auto mb-3" />

            <h2 className="text-xl font-bold text-red-600">
              Aucune classe disponible
            </h2>

            <p className="text-gray-600 mt-2 mb-4">
              Créez une classe avant d’ajouter un étudiant
            </p>

            <div className="flex gap-3 justify-center">

              <button
                onClick={() => navigate("/SchoolClass/create")}
                className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Plus size={16} />
                Créer
              </button>

              <button
                onClick={() => navigate("/students")}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Retour
              </button>

            </div>
          </div>
        </div>
      )}

      {/* FORM */}
      <div className={`flex-1 p-6 ${noClassModal ? "opacity-40 pointer-events-none" : ""}`}>

        <form onSubmit={handleSubmit} className="space-y-6">

          <PersonalInfoSection student={student} handleChange={handleChange} errors={errors} />
          <ContactSection student={student} handleChange={handleChange} setStudent={setStudent} errors={errors} />
          <AcademicInfoSection student={student} handleChange={handleChange} setStudent={setStudent} errors={errors} />
          <GuardianSection student={student} handleChange={handleChange} setStudent={setStudent} errors={errors} />
          <NotesSection student={student} handleChange={handleChange} errors={errors} />
          <DocumentsSection student={student} handleChange={handleChange} errors={errors} />
          <TuitionPayment student={student} setStudent={setStudent} errors={errors} />

          <div className="flex justify-end gap-3 pt-5 border-t">

            <button
              type="button"
              onClick={() => navigate("/students")}
              className="px-5 py-2 bg-gray-500 text-white rounded flex items-center gap-2"
            >
              <X size={16} />
              Annuler
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-red-600 text-white rounded flex items-center gap-2"
            >
              <Save size={16} />
              Enregistrer
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
