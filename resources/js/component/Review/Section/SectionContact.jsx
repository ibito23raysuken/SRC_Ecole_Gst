// ContactSection.jsx
import React from "react";
import Section from "../Section/section";
import EditableField from "../Edit/EditableField";

export default function SectionContact({ student, setStudent }) {
    const handleParentPhoneChange = (index, value) => {
        setStudent(prev => {
            const updatedParents = [...prev.parents];
            updatedParents[index].phone = value;
            console.log("Contact parent mis à jour :", updatedParents[index]);
            return { ...prev, parents: updatedParents };
        });
    };

    return (
        <Section title="Coordonnées">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <EditableField
                    cle="address"
                    label="Adresse"
                    value={student.address}
                    student={student}
                    setStudent={setStudent}
                />

                <EditableField
                    cle="city"
                    label="Ville"
                    value={student.city}
                    student={student}
                    setStudent={setStudent}
                />

                <EditableField
                    cle="postal_code"
                    label="Code postal"
                    value={student.postal_code}
                    student={student}
                    setStudent={setStudent}
                />

                <EditableField
                    cle="phone"
                    label="Téléphone"
                    value={student.phone}
                    student={student}
                    setStudent={setStudent}
                />

                {/* --- Contacts des parents --- */}
                {student.parents &&
                    student.parents.length > 0 &&
                    student.parents.map((parent, idx) => (
                        <EditableField
                            key={idx}
                            label={`${parent.relationship === "mother" ? "Mère" : "Père"} : ${parent.name}`}
                            value={parent.phone}
                            onChange={(val) => handleParentPhoneChange(idx, val)}
                        />
                    ))
                }
            </div>
        </Section>
    );
}
