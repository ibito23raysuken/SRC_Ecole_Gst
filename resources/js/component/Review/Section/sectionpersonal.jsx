import { useMemo } from 'react';
import Section from '../Section/section';
import EditableDate from '../Edit/EditableDate';
import EditableField from '../Edit/EditableField';
import EditableGender from '../Edit/EditableGender';

export default function PersonalInfoSection({ student, updateStudentField }) {
  const age = useMemo(() => {
    if (!student?.birth_date) return null;
    const birthDate = new Date(student.birth_date);
    if (Number.isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let value = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) value -= 1;
    return value;
  }, [student?.birth_date]);

  return (
    <Section title="Informations personnelles">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <EditableDate student={student} value={student.birth_date} updateStudentField={updateStudentField} />
        <EditableField field="birth_place" label="Lieu de naissance" value={student.birth_place} student={student} updateStudentField={updateStudentField} />
        <EditableGender value={student.gender} student={student} updateStudentField={updateStudentField} />
        <EditableField field="nationality" label="Nationalité" value={student.nationality} student={student} updateStudentField={updateStudentField} />
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
          <div><p className="mb-1 text-sm text-gray-500">Âge</p><p className="font-medium text-gray-800">{age !== null ? `${age} ans` : 'Non renseigné'}</p></div>
        </div>
      </div>
    </Section>
  );
}
