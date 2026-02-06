import EditableFullName from "./Edit/EditableFullName";
import YearSelectorEditable from "./Edit/YearSelectorEditable";
import GradeLevelEditable from "./Edit/GradeLevelEditable";
import EditableProfileImage from "./Edit/EditableProfileImage";

export default function Header({ student, setStudent, activeSection, setActiveSection }) {
  const sections = [
    { id: 'personal', title: 'Informations Personnelles' },
    { id: 'parents', title: 'Informations Parents' },
    { id: 'contact', title: 'Coordonnées' },
    { id: 'education', title: 'Scolarité' },
    { id: 'performance', title: 'Performance' },
    { id: 'documents', title: 'Documents' }
  ];

  // Fonction pour mettre à jour le student
  const updateStudentField = (updatedStudent) => {
    setStudent(updatedStudent.student);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">

      {/* GAUCHE */}
      <div className="w-full">

        {/* Nom complet */}
        <EditableFullName
          student={student}
          updateStudentField={updateStudentField}
        />

        {/* Année scolaire */}
        <YearSelectorEditable student={student} updateStudentField={updateStudentField} />

        {/* Classe / Niveau */}
        <GradeLevelEditable student={student} updateStudentField={updateStudentField} />

        {/* Navigation sections */}
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

      {/* DROITE */}
      <div className="flex flex-col items-center md:items-end gap-3">
        <EditableProfileImage student={student} updateStudentField={updateStudentField} />
      </div>
    </div>
  );
}
