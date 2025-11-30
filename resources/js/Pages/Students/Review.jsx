import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';

import Header from '../../component/Review/headerReview';
import PersonalInfoSection from '../../component/Review/Section/sectionpersonal';
import SectionContact from '../../component/Review/Section/SectionContact';
import SectionPerformance from '../../component/Review/Section/sectionperformance';
import SchoolSection from '../../component/Review/Section/SchoolSection';
import SectionDocuments from '../../component/Review/Section/SectionDocuments';
import { getStudentsApi } from '../../api/apistudents';
import SectionParents from '../../component/Review/Section/SectionParents';
import SectionaddParents from '../../component/Review/Section/Sectionaddparent';

export default function StudentProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AppContext);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progressModalOpen, setProgressModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');


    useEffect(() => {
    const fetchStudentData = async () => {
        if (!token || !id) return;

        setLoading(true);
        try {
            const formattedData = await getStudentsApi(id, token);
            setStudent(formattedData);
            console.log("Données de l'étudiant prêtes :", formattedData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchStudentData();
    }, [id, token]);

    if (loading) return <Loading />;
    if (error || !student) return <Error message={error} />;

    return (
        <div className="max-w-6xl mx-auto mt-5 p-6 bg-white rounded-lg shadow-lg">
            {/* En-tête */}
            <Header
                student={student}
                setStudent={setStudent}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                progressModalOpen={progressModalOpen}
                setProgressModalOpen={setProgressModalOpen}
            />

            {/* Sections */}
            {activeSection === 'personal' && (
               <PersonalInfoSection student={student} setStudent={setStudent} />
            )}

            {activeSection === 'contact' && (
                <SectionContact student={student} setStudent={setStudent} />
            )}

            {activeSection === 'parents' && (

                <SectionParents  student={student} setStudent={setStudent} />
            )}
            {activeSection === 'education' && (
                <SchoolSection student={student} setStudent={setStudent} />
            )}

            {activeSection === 'performance' && (
                <SectionPerformance student={student} setStudent={setStudent} />
            )}

            {activeSection === 'documents' && (
                <SectionDocuments student={student} setStudent={setStudent} />
            )}

            {/* Boutons généraux */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <button onClick={() => navigate('/students')} className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
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
                <p className="mt-1">{message || 'Aucune donnée trouvée'}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                    Réessayer
                </button>
            </div>
        </div>
    );
}

