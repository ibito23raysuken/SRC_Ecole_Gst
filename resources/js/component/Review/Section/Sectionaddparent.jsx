import { useState } from 'react';
import Section from "./section";
import EditableField from "../Edit/EditableField";
import { Edit3, Save, Plus } from "lucide-react";

export default function SectionParents({ student, setStudent }) {
    const [showParents, setShowParents] = useState(false);
    console.log("Rendu de la section Ajouter Parents avec les données :", student.guardians);
    // Ajouter un parent vide
    const addParent = () => {
        const newParent = {
            first_name: "",
            last_name: "",
            relationship: "",
            phone: "",
            email: "",
            profession: ""
        };
        setStudent(prev => ({
            ...prev,
            guardians: [...(prev.guardians || []), newParent]
        }));
        setShowParents(true);
    };

    // Supprimer un parent
    const removeParent = (index) => {
        setStudent(prev => {
            const updated = [...prev.guardians];
            updated.splice(index, 1);
            return { ...prev, guardians: updated };
        });
    };

    // Modifier un champ d'un parent
    const handleParentChange = (index, field, value) => {
        setStudent(prev => {
            const updated = [...prev.guardians];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, guardians: updated };
        });
    };

    return (
        <Section title="Informations Parents">
            <div className="space-y-4">
                {student.guardians && student.guardians.length > 0 ? (
                    student.guardians.map((parent, index) => (
                        <div key={index} className="p-3 border rounded-md bg-gray-50 space-y-2 relative">
                            <h3 className="font-semibold text-lg mb-2">
                                Parent {index + 1} ({parent.relationship || 'Tuteur'})
                            </h3>
                            <button
                                type="button"
                                onClick={() => removeParent(index)}
                                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
                                title="Supprimer ce parent"
                            >
                                &times;
                            </button>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <EditableField
                                    label="Prénom"
                                    value={parent.first_name}
                                    editing={true}
                                    onChange={(val) => handleParentChange(index, 'first_name', val)}
                                />
                                <EditableField
                                    label="Nom"
                                    value={parent.last_name}
                                    editing={true}
                                    onChange={(val) => handleParentChange(index, 'last_name', val)}
                                />
                                <EditableField
                                    label="Relation"
                                    value={parent.relationship}
                                    editing={true}
                                    onChange={(val) => handleParentChange(index, 'relationship', val)}
                                />
                                <EditableField
                                    label="Téléphone"
                                    value={parent.phone}
                                    editing={true}
                                    onChange={(val) => handleParentChange(index, 'phone', val)}
                                />
                                <EditableField
                                    label="Email"
                                    value={parent.email}
                                    editing={true}
                                    onChange={(val) => handleParentChange(index, 'email', val)}
                                />
                                <EditableField
                                    label="Profession"
                                    value={parent.profession}
                                    editing={true}
                                    onChange={(val) => handleParentChange(index, 'profession', val)}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    !showParents && (
                        <div className="text-right mb-4">
                            <button
                                type="button"
                                onClick={addParent}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Ajouter un parent/tuteur
                            </button>
                        </div>
                    )
                )}

                {showParents && (
                    <div className="text-right mt-2">
                        <button
                            type="button"
                            onClick={addParent}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Ajouter un autre parent
                        </button>
                    </div>
                )}
            </div>
        </Section>
    );
}
function EditableParent({ parent, index, onSave, onRemove }) {
    const [localParent, setLocalParent] = useState(parent);

    const handleChange = (field, value) => {
        setLocalParent(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-4 border rounded-md bg-gray-50 relative">
            {/* Bouton suppression */}
            <button
                onClick={onRemove}
                className="absolute top-2 right-2 text-red-500"
            >
                <X className="w-5 h-5" />
            </button>

            <EditableField label="Nom complet" value={localParent.name} onChange={v => handleChange("name", v)} />
            <EditableField label="Téléphone" value={localParent.phone} onChange={v => handleChange("phone", v)} />
            <EditableField label="Email" value={localParent.email} onChange={v => handleChange("email", v)} />

            <button
                onClick={() => onSave(index, localParent)}
                className="mt-3 px-4 py-2 bg-green-500 text-white rounded"
            >
                <Save className="w-4 h-4" /> Enregistrer
            </button>
        </div>
    );
}
