import Section from "../Section/section";
import EditableDate from "../Edit/EditableDate";
import EditableField from "../Edit/EditableField";
import EditableGender from "../Edit/EditableGender";

export default function PersonalInfoSection({ student ,updateStudentField }) {
    // Fonction pour calculer l’âge à partir de la date de naissance
    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        return Math.floor(
            (new Date() - new Date(birthDate)) / (365.25 * 24 * 60 * 60 * 1000)
        );
    };

    const age = calculateAge(student.birth_date);


    return (
        <Section title="Informations Personnelles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Date de naissance */}
                <EditableDate
                    student={student}
                    value={student.birth_date || ""}
                    updateStudentField={updateStudentField}
                />

                {/* Lieu de naissance */}
                <EditableField
                    field="birth_place"
                    label="Lieu de naissance"
                    value={student.birth_place}
                    student={student}
                    updateStudentField={updateStudentField}
                />
                {/* Genre */}
                <EditableGender
                    value={student.gender || ""}
                    student={student}
                    updateStudentField={updateStudentField}
                />

                {/* Nationalité */}
                <EditableField
                    field="nationality"
                    label="Nationalité"
                    value={student.nationality}
                    student={student}
                    updateStudentField={updateStudentField}
                />

                {/* Âge calculé (non modifiable) */}
                <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Âge</p>
                        <p className="font-medium text-gray-800">
                            {age !== null ? `${age} ans` : "Non renseigné"}
                        </p>
                    </div>
                </div>

            </div>
        </Section>
    );
}
