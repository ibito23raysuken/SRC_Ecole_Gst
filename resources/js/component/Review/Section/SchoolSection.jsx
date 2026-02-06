// SchoolSection.jsx
import React from "react";
import { School, CreditCard } from "lucide-react";
import Section from "../Section/section";
import EditableField from "../Edit/EditableField";
import EditablePaymentStatus from "../Edit/EditablePaymentStatus";

export default function SchoolSection({ student, setStudent }) {
    return (
        <Section title="Scolarité">
            <div className="space-y-8">

                {/* Infos scolaires */}
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <div className="flex items-center gap-2 mb-6 text-gray-700">
                        <School className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">
                            Informations scolaires
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>
                </div>

                {/* Paiement */}
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <EditablePaymentStatus
                        cle="paymentStatus"
                        label="Statut de paiement"
                        value={student.paymentStatus}
                        student={student}
                        setStudent={setStudent}
                    />
                </div>

            </div>
        </Section>
    );
}
