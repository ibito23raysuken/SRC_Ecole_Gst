// ContactSection.jsx
import React from "react";
import Section from "../Section/section";
import EditableField from "../Edit/EditableField";

export default function SectionContact({ student, updateStudentField }) {

    return (
        <Section title="Coordonnées">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <EditableField
                    field="address"
                    label="Lieu de Adresse"
                    value={student.address}
                    student={student}
                    updateStudentField={updateStudentField}
                />

                <EditableField
                    field="city"
                    label="Ville"
                    value={student.city}
                    student={student}
                    updateStudentField={updateStudentField}
                />

                <EditableField
                    field="postal_code"
                    label="Code postal"
                    value={student.postal_code}
                    student={student}
                    updateStudentField={updateStudentField}
                />

                <EditableField
                    field="phone"
                    label="Téléphone"
                    value={student.phone}
                    student={student}
                    updateStudentField={updateStudentField}
                />
            </div>
        </Section>
    );
}
