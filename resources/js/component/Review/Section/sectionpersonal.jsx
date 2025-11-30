import Section from "../Section/section";
import EditableDate from "../Edit/EditableDate";
import EditableField from "../Edit/EditableField";
import EditableGender from "../Edit/EditableGender";

export default function PersonalInfoSection({ student, setStudent }) {
    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        return Math.floor((new Date() - new Date(birthDate)) / (365.25 * 24 * 60 * 60 * 1000));
    };

    const age = calculateAge(student.birthDate);

    return (
        <Section title="Informations Personnelles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Date de naissance */}
                <EditableDate
                    student={student}
                    value={student.birthDate}
                    setStudent={setStudent}
                />

                {/* Lieu de naissance */}
                <EditableField
                    cle="birth_place"
                    label="Lieu de naissance"
                    value={student.birth_place}
                    student={student}
                    setStudent={setStudent}
                />

                {/* Genre */}
                <EditableGender
                    value={student.gender}
                    student={student}
                    setStudent={setStudent}
                />

                {/* Nationalité */}
                <EditableField
                    cle="nationality"
                    label="Nationalité"
                    value={student.nationality}
                    student={student}
                    setStudent={setStudent}
                />

                {/* Âge calculé */}
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
