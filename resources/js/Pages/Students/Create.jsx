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
        tuition_payment: "",
        registration_months: [],
        student_image: null,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setStudent({
            ...student,
            [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(student).forEach((key) => formData.append(key, student[key]));

            await createStudentApi(formData, token);
            toast.success("Étudiant créé avec succès !");
            navigate("/students");
        } catch (err) {
            toast.error("Erreur lors de l’enregistrement");
        }
    };

    return (
        <div className="flex">
            {/* Sidebar/Selecteur (supposé existant) */}
            <div className="w-64 min-h-screen ">
                {/* Votre sélecteur latéral ici */}
            </div>

            {/* Contenu principal */}
            <div className="flex-1 min-h-screen p-4 lg:p-6">
                <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">

                    {/* --- SECTION 1 : INFORMATIONS PERSONNELLES --- */}
                    <PersonalInfoSection student={student} handleChange={handleChange} />

                    {/* --- SECTION 2 : CONTACT --- */}
                    <ContactSection student={student} handleChange={handleChange} />

                    {/* --- SECTION 3 : SCOLARITÉ --- */}
                    <AcademicInfoSection student={student} handleChange={handleChange} />
                    {/* --- SECTION 4 : RESPONSABLE LÉGAL --- */}
                    <GuardianSection student={student} handleChange={handleChange} />
                    {/* --- SECTION 5 : NOTES --- */}
                    <NotesSection student={student} handleChange={handleChange} />
                    {/* --- SECTION 6 : DOCUMENTS --- */}
                    <DocumentsSection student={student} handleChange={handleChange} />
                    <TuitionPayment
                        student={student}
                        handleChange={handleChange}
                    />
                    {/* --- BOUTONS --- */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 lg:gap-4 pt-4 lg:pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
                        >
                            <X className="w-4 h-4" />
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                        >
                            <Save className="w-4 h-4" />
                            Enregistrer
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
