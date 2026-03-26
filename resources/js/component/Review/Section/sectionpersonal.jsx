import { useMemo } from "react";
import Section from "../Section/section";
import EditableDate from "../Edit/EditableDate";
import EditableField from "../Edit/EditableField";
import EditableGender from "../Edit/EditableGender";

export default function PersonalInfoSection({ student, updateStudentField }) {

  const age = useMemo(() => {
    if (!student?.birth_date) return null;

    const birthDate = new Date(student.birth_date);
    if (isNaN(birthDate)) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }, [student?.birth_date]);
  return (
    <Section title="Informations Personnelles">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <EditableDate
          student={student}
          value={student.birth_date}
          updateStudentField={updateStudentField}
        />

        <EditableField
          field="birth_place"
          label="Lieu de naissance"
          value={student.birth_place}
          student={student}
          updateStudentField={updateStudentField}
        />

        <EditableGender
          value={student.gender}
          student={student}
          updateStudentField={updateStudentField}
        />

        <EditableField
          field="nationality"
          label="Nationalité"
          value={student.nationality}
          student={student}
          updateStudentField={updateStudentField}
        />

        {/* AGE */}
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
