import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { toast, Toaster } from "react-hot-toast";

import Header from "../../component/Review/headerReview";
import PersonalInfoSection from "../../component/Review/Section/sectionpersonal";
import SectionContact from "../../component/Review/Section/SectionContact";
import SectionPerformance from "../../component/Review/Section/sectionperformance";
import SchoolSection from "../../component/Review/Section/SchoolSection";
import SectionDocuments from "../../component/Review/Section/SectionDocuments";
import SectionParents from "../../component/Review/Section/Sectionaddparent";
import { getStudentsApi } from "../../api/apistudents";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("personal");

  // ===============================
  // FETCH STUDENT DATA
  // ===============================
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!token || !id) return;
      setLoading(true);
      try {
        console.log("apper une fois le token et l'id disponibles :", { id, token });
        const data = await getStudentsApi(id, token);
        // ⚠️ Assurer que guardians existe toujours
        if (!data.guardians) data.guardians = [];
        setStudent(data);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [id, token]);

  // ===============================
  // UPDATE STUDENT FIELD
  // ===============================
  // Cette fonction est passée à tous les composants enfants
  // Elle **merge toujours l'ancien state avec les nouvelles données**
    const updateStudentField = (data, message) => {
    setStudent((prev) => {
        // ⚡ Si data contient un champ `field` et `value`, on merge juste ce champ
        console.log("updateStudentField appelé avec :", data, message);
        if (data.field && data.value !== undefined) {
        return { ...prev, [data.field]: data.value };
        }
        // ⚡ Si data contient `guardians` ou d'autres objets, on merge tout directement
        return { ...prev, ...data };
    });

    if (message) toast.success(message, { position: "top-right" });
    };

  if (loading) return <Loading />;
  if (error || !student) return <Error message={error} />;
  console.log("Données de l'élève chargées :", student.guardians);
  return (
    <div className="max-w-6xl mx-auto mt-5 p-6 bg-white rounded-lg shadow-lg">
      <Toaster position="top-right" />

      {/* ===============================
          HEADER
          Le Header peut modifier le nom, l'année scolaire, le niveau et l'image
      =============================== */}
      <Header
        student={student}
        setStudent={setStudent}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        updateStudentField={updateStudentField} // ⚠️ Important pour que Header utilise le merge
      />

      {/* ===============================
          SECTIONS
          Affichage conditionnel selon la section active
      =============================== */}
      {activeSection === "personal" && (
        <PersonalInfoSection
          student={student}
          token={token}
          updateStudentField={updateStudentField}
        />
      )}
      {activeSection === "parents" && (
        <SectionParents
          student={student}
          token={token}
          updateStudentField={updateStudentField}
        />
      )}
      {activeSection === "contact" && (
        <SectionContact
          student={student}
          updateStudentField={updateStudentField}
        />
      )}
      {activeSection === "education" && (
        <SchoolSection student={student} updateStudentField={updateStudentField} />
      )}
      {activeSection === "performance" && (
        <SectionPerformance
          student={student}
          updateStudentField={updateStudentField}
        />
      )}
      {activeSection === "documents" && (
        <SectionDocuments
          student={student}
          updateStudentField={updateStudentField}
        />
      )}

      {/* ===============================
          BOUTON RETOUR
      =============================== */}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => navigate("/students")}
          className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Retour à la liste
        </button>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
      <p className="mt-4 text-red-700">Chargement des informations de l'élève...</p>
    </div>
  );
}

function Error({ message }) {
  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 text-center">
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        <h3 className="text-lg font-medium mt-2">Erreur de chargement</h3>
        <p className="mt-1">{message || "Aucune donnée trouvée"}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
