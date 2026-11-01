
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
    guardians_data: {},
  });

  const [errors, setErrors] = useState({});
  const [noClassModal, setNoClassModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation du formulaire
  const validateStudent = (data) => {
    const validationErrors = {};

    if (!data.first_name?.trim()) {
      validationErrors.first_name = ["Prénom requis"];
    }

    if (!data.last_name?.trim()) {
      validationErrors.last_name = ["Nom requis"];
    }

    if (!data.birth_date) {
      validationErrors.birth_date = [
        "Date de naissance requise",
      ];
    }

    if (!data.gender) {
      validationErrors.gender = ["Genre requis"];
    }

    if (!data.phone?.trim()) {
      validationErrors.phone = ["Téléphone requis"];
    }

    if (!data.registration_status) {
      validationErrors.registration_status = [
        "Statut d'inscription requis",
      ];
    }

    if (!data.school_class_id) {
      validationErrors.school_class_id = ["Classe requise"];
    }

    return validationErrors;
  };

  // Vérifier les classes disponibles
  useEffect(() => {
    let active = true;

    const checkClasses = async () => {
      try {
        const classes = await getAllSchoolClassesApi(token);

        if (active && (!classes || classes.length === 0)) {
          setNoClassModal(true);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des classes :", error);
      }
    };

    if (token) {
      checkClasses();
    }

    return () => {
      active = false;
    };
  }, [token]);

  // Gestion des champs, cases à cocher et fichiers
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    const newValue =
      type === "checkbox"
        ? checked
        : type === "file"
          ? files?.[0] ?? null
          : name === "school_class_id"
            ? value
              ? Number(value)
              : null
            : value;

    if (name.startsWith("guardian_")) {
      setStudent((prev) => ({
        ...prev,
        guardians_data: {
          ...prev.guardians_data,
          [name]: newValue,
        },
      }));
    } else {
      setStudent((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }

    // Supprimer l'erreur du champ modifié
    setErrors((prev) => {
      if (!prev[name]) return prev;

      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  // Création de l'étudiant
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (noClassModal) {
      toast.error("Veuillez créer une classe d'abord.");
      return;
    }

    const validationErrors = validateStudent(student);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(Object.values(validationErrors)[0][0]);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const formData = new FormData();

      // Champs textuels et identifiants
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
      ];

      fields.forEach((field) => {
        const value = student[field];

        formData.append(
          field,
          value === null || value === undefined ? "" : String(value)
        );
      });

      // Identifiant de la classe
      if (
        student.school_class_id !== null &&
        student.school_class_id !== undefined
      ) {
        formData.append(
          "school_class_id",
          String(student.school_class_id)
        );
      }

      // Documents : valeurs booléennes
      formData.append(
        "birth_certificate",
        student.birth_certificate ? "1" : "0"
      );

      formData.append(
        "medical_certificate",
        student.medical_certificate ? "1" : "0"
      );

      formData.append(
        "residence_certificate",
        student.residence_certificate ? "1" : "0"
      );

      formData.append(
        "report_card",
        student.report_card ? "1" : "0"
      );

      // PHOTO DE L'ÉTUDIANT
      if (student.student_image instanceof File) {
        formData.append(
          "student_image",
          student.student_image,
          student.student_image.name
        );

        console.log("Photo prête à être envoyée :", {
          name: student.student_image.name,
          type: student.student_image.type,
          size: student.student_image.size,
        });
      } else {
        console.warn(
          "Aucune photo sélectionnée ou fichier invalide :",
          student.student_image
        );
      }

      // Statut de paiement
      formData.append(
        "registration_status",
        student.registration_status || "not_paid"
      );

      // Mois payés
      if (Array.isArray(student.paid_months)) {
        student.paid_months.forEach((month) => {
          formData.append("paid_months[]", String(month));
        });
      }

      // Regrouper les informations des parents
      const grouped = {};

      Object.entries(student.guardians_data || {}).forEach(
        ([key, value]) => {
          const match = key.match(/^guardian_(\d+)_(.+)$/);

          if (!match) return;

          const id = match[1];
          const field = match[2];

          if (!grouped[id]) {
            grouped[id] = {};
          }

          grouped[id][field] = value;
        }
      );

      const parentsArray = Object.values(grouped).filter(
        (parent) =>
          typeof parent.name === "string" &&
          parent.name.trim() !== ""
      );

      // Attention : les fichiers des parents ne doivent pas être
      // sérialisés en JSON. Ils nécessitent un traitement séparé.
      formData.append("parents", JSON.stringify(parentsArray));

      // Diagnostic temporaire : vérifier le contenu de FormData
      console.log("Photo dans FormData :", formData.get("student_image"));

      // Envoyer les données à Laravel
      await createStudentApi(formData, token);

      toast.success("Étudiant créé avec succès !");
      navigate("/students");
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'étudiant :",
        error
      );

      const responseData = error.response?.data;

      if (responseData?.errors) {
        setErrors(responseData.errors);

        const firstError = Object.values(responseData.errors)
          .flat()
          .find(Boolean);

        toast.error(firstError || "Vérifiez les champs du formulaire.");
      } else {
        toast.error(
          responseData?.message ||
            "Erreur lors de l'enregistrement de l'étudiant."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex">
      {/* Fenêtre si aucune classe n'est disponible */}
      {noClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-xl bg-white p-8 text-center">
            <button
              type="button"
              aria-label="Retour"
              className="absolute right-3 top-3"
              onClick={() => navigate("/students")}
            >
              <X />
            </button>

            <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-yellow-500" />

            <h2 className="text-xl font-bold text-red-600">
              Aucune classe disponible
            </h2>

            <p className="mb-4 mt-2 text-gray-600">
              Créez une classe avant d'ajouter un étudiant.
            </p>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/SchoolClass/create")}
                className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white"
              >
                <Plus size={16} />
                Créer
              </button>

              <button
                type="button"
                onClick={() => navigate("/students")}
                className="rounded bg-gray-400 px-4 py-2 text-white"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <div
        className={`flex-1 p-6 ${
          noClassModal ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
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
            setStudent={setStudent}
            errors={errors}
          />

          <GuardianSection
            student={student}
            handleChange={handleChange}
            setStudent={setStudent}
            errors={errors}
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

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={() => navigate("/students")}
              disabled={loading}
              className="flex items-center gap-2 rounded bg-gray-500 px-5 py-2 text-white disabled:opacity-50"
            >
              <X size={16} />
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading || noClassModal}
              className="flex items-center gap-2 rounded bg-red-600 px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

