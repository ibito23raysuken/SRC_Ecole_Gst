import EditableFullName from "./Edit/EditableFullName";
import YearSelectorEditable from "./Edit/YearSelectorEditable";
import GradeLevelEditable from "./Edit/GradeLevelEditable";
import EditableProfileImage from "./Edit/EditableProfileImage";
export default function Header({
    student,
    setStudent,
    activeSection,
    setActiveSection,
    progressModalOpen,
    setProgressModalOpen
}) {

    const sections = [
        { id: 'personal', title: 'Informations Personnelles' },
        { id: 'parents', title: 'Informations Parents' },
        { id: 'contact', title: 'Coordonnées' },
        { id: 'education', title: 'Scolarité' },
        { id: 'performance', title: 'Performance' },
        { id: 'documents', title: 'Documents' }
    ];

    return (
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">

            {/* ================================
                ▶️ GAUCHE : Nom + Year + Classe + Tabs
               ================================ */}
            <div className="w-full">
                {/* ▷ Nom Editable */}
                <div className="flex items-center justify-between">
                    <h1>
                        <EditableFullName student={student} setStudent={setStudent} />
                    </h1>
                </div>

                {/* ▷ Année d'inscription */}
                <YearSelectorEditable
                    value={student.academicYear}
                    student={student}
                />

                {/* ▷ Niveau / Classe */}
                <div className='mt-3 gap-4'>
                    <GradeLevelEditable
                        value={student.gradeLevel}
                        student={student}
                    />
                </div>

                {/* ▷ Navigation Sections */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                                ${activeSection === section.id
                                    ? 'text-white bg-red-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {section.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* ================================
                ▶️ DROITE : Image + bouton dossier
               ================================ */}
            <div className="flex flex-col items-center md:items-end gap-3">
                {/* ▷ Photo */}
                <EditableProfileImage
                    student={student}
                    setStudent={setStudent}
                />

                {/* ▷ Progression du dossier */}
                <button
                    onClick={() => setProgressModalOpen(true)}
                    className="flex items-center px-4 py-2 rounded-md text-white font-medium bg-red-600 hover:bg-red-700"
                >
                    Progression du dossier
                </button>
            </div>
        </div>
    );
}
