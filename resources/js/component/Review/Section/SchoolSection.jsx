// SchoolSection.jsx
import React from "react";
import Section from "../Section/section";
import EditableField from "../Edit/EditableField";

export default function SchoolSection({ student, setStudent }) {
    return (
        <Section title="Scolarité">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <EditableField
                    cle="academicYear"
                    label="Année scolaire"
                    value={student.academicYear}
                    student={student}
                    setStudent={setStudent}
                />

                <EditableField
                    cle="gradeLevel"
                    label="Niveau"
                    value={student.gradeLevel}
                    student={student}
                    setStudent={setStudent}
                />

                <EditableField
                    cle="previousSchool"
                    label="Établissement précédent"
                    value={student.previousSchool || "Non renseigné"}
                    student={student}
                    setStudent={setStudent}
                />

                <EditableField
                    cle="previousClass"
                    label="Classe précédente"
                    value={student.previousClass || "Non renseigné"}
                    student={student}
                    setStudent={setStudent}
                />

                <EditableField
                    cle="paymentStatus"
                    label="Statut de paiement"
                    value={student.paymentStatus}
                    student={student}
                    setStudent={setStudent}
                />
            </div>
        </Section>
    );
}
