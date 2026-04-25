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

import { getStudentApi } from "../../api/apistudents";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("personal");

  /**
   * 📡 FETCH DATA
   */
  useEffect(() => {
    const fetchStudent = async () => {
      if (!token || !id) return;

      setLoading(true);

      try {
        //console.log("FETCH STUDENT:", { id, token });

        const data = await getStudentApi(id);

        setStudent({
          ...data,
          guardians: data.guardians || []
        });

      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Erreur serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, token]);
  /**
   * 🔄 UPDATE STATE SAFE
   */
  const updateStudentField = (data, message) => {
    setStudent((prev) => {
      if (!prev) return prev;

      if (data.field && data.value !== undefined) {
        return { ...prev, [data.field]: data.value };
      }

      return { ...prev, ...data };
    });

    if (message) toast.success(message);
  };

  /**
   * 🧪 STATES
   */
  if (loading) return <Loading />;
  if (error || !student) return <Error message={error} />;

  return (
    <div className="max-w-6xl mx-auto mt-5 p-6 bg-white rounded-lg shadow-lg">
      <Toaster />

      <Header
        student={student}
        setStudent={setStudent}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        updateStudentField={updateStudentField}
      />

      {activeSection === "personal" && (
        <PersonalInfoSection
          student={student}
          updateStudentField={updateStudentField}
        />
      )}

      {activeSection === "parents" && (
        <SectionParents
          student={student}
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
        <SchoolSection
          student={student}
          updateStudentField={updateStudentField}
        />
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

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/students")}
          className="px-5 py-2 border rounded"
        >
          Retour
        </button>
      </div>
    </div>
  );
}

/**
 * ⏳ LOADING
 */
function Loading() {
  return (
    <div className="text-center mt-10">
      <p>Chargement...</p>
    </div>
  );
}

/**
 * ❌ ERROR
 */
function Error({ message }) {
  return (
    <div className="text-center mt-10 text-red-600">
      <p>{message || "Erreur"}</p>
      <button onClick={() => window.location.reload()}>
        Réessayer
      </button>
    </div>
  );
}
