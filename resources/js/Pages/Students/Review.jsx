import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';

import Header from '../../component/Review/headerReview';
import PersonalInfoSection from '../../component/Review/Section/sectionpersonal';
import SectionContact from '../../component/Review/Section/SectionContact';
import SectionPerformance from '../../component/Review/Section/sectionperformance';
import SchoolSection from '../../component/Review/Section/SchoolSection';
import SectionDocuments from '../../component/Review/Section/SectionDocuments';
import SectionParents from '../../component/Review/Section/Sectionaddparent';
import { getStudentsApi, updateStudentApi } from '../../api/apistudents';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');

  // ⚡ Charger l’élève
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!token || !id) return;
      setLoading(true);
      try {
        const formattedData = await getStudentsApi(id, token);
        setStudent(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [id, token]);

    const updateStudentField = (field, value) => {
    console.log("Student value:", value );
    setStudent(prev => ({
        ...prev,
        [field]: value,
    }));
    };
  if (loading) return <Loading />;
  if (error || !student) return <Error message={error} />;

  return (
    <div className="max-w-6xl mx-auto mt-5 p-6 bg-white rounded-lg shadow-lg">

      {/* Header */}
      <Header
        student={student}
        setStudent={setStudent}   // <-- ici
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        progressModalOpen={progressModalOpen}
        setProgressModalOpen={setProgressModalOpen}
        />


      {/* Sections */}
      {activeSection === 'personal' && (
        <PersonalInfoSection
          student={student}
          updateStudentField={updateStudentField}
        />
      )}
    {activeSection === 'parents' && (
        <SectionParents
          student={student}
          onChange={(field, value) =>
            setStudent(prev => ({ ...prev, [field]: value }))
          }
        />
      )}
      {activeSection === 'contact' && (
        <SectionContact
          student={student}
          updateStudentField={updateStudentField}
        />
      )}

      {activeSection === 'education' && (
        <SchoolSection
          student={student}
          onChange={(field, value) =>
            setStudent(prev => ({ ...prev, [field]: value }))
          }
        />
      )}
      {activeSection === 'performance' && (
        <SectionPerformance
          student={student}
          onChange={(field, value) =>
            setStudent(prev => ({ ...prev, [field]: value }))
          }
        />
      )}
      {activeSection === 'documents' && (
        <SectionDocuments
          student={student}
          onChange={(field, value) =>
            setStudent(prev => ({ ...prev, [field]: value }))
          }
        />
      )}

      {/* Boutons généraux */}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => navigate('/students')}
          className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Retour à la liste
        </button>

      </div>

      {saveError && (
        <p className="text-red-600 mt-2 text-center">{saveError}</p>
      )}
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
        <p className="mt-1">{message || 'Aucune donnée trouvée'}</p>
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
