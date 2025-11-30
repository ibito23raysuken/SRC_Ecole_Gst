import { useState } from "react";
import Section from "./section";
import EditableField from "../Edit/EditableField";
import { Save, Plus, X } from "lucide-react";

export default function SectionParents({ student, setStudent }) {
    const MAX_GUARDIANS = 4;
    const [showForm, setShowForm] = useState(false);

    const addParent = (data) => {
        const newParent = {
            id: Date.now(),
            name: data?.name || "",
            phone: data?.phone || "",
            email: data?.email || "",
        };

        setStudent(prev => ({
            ...prev,
            guardians: [...(prev.guardians || []), newParent],
        }));

        setShowForm(false);
    };

    const removeParent = (id) => {
        setStudent(prev => ({
            ...prev,
            guardians: prev.guardians.filter(p => p.id !== id),
        }));
    };

    const handleSaveForm = (index, updatedParent) => {
        setStudent(prev => {
            const newGuardians = [...prev.guardians];
            newGuardians[index] = updatedParent;
            return { ...prev, guardians: newGuardians };
        });
    };

    return (
        <Section title="Informations Parents">
            <div className="space-y-6">

                {/* LISTE DES PARENTS */}
                {student.guardians?.map((parent, index) => (
                    <EditableParent
                        key={parent.id}
                        parent={parent}
                        index={index}
                        onSave={handleSaveForm}
                        onRemove={() => removeParent(parent.id)}
                    />
                ))}

                {/* BOUTON AJOUT */}
                {!showForm &&
                    (student.guardians?.length || 0) < MAX_GUARDIANS && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Ajouter un parent
                        </button>
                    )}

                {/* FORMULAIRE */}
                {showForm && (
                    <FormNewParent
                        onSave={addParent}
                        setShowForm={setShowForm}
                    />
                )}
            </div>
        </Section>
    );
}


// 🔹 FORMULAIRE D’AJOUT
function FormNewParent({ onSave, setShowForm }) {
    const [form, setForm] = useState({ name: "", phone: "", email: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(form);
    };

    return (
        <div className="p-5 border rounded-lg bg-gray-50 shadow space-y-4">
            <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nom complet"
                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-red-600"
            />

            <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Téléphone"
                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-red-600"
            />

            <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-red-600"
            />

            <div className="flex gap-3 justify-end">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                    <Save className="w-4 h-4 inline-block" /> Enregistrer
                </button>

                <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Annuler
                </button>
            </div>
        </div>
    );
}


// 🔹 EDITER UN PARENT
function EditableParent({ parent, index, onSave, onRemove }) {
    const [localParent, setLocalParent] = useState(parent);

    return (
        <div className="p-5 border rounded-lg bg-white shadow relative space-y-3">

            {/* Delete */}
            <button
                onClick={onRemove}
                className="absolute top-2 right-2 text-red-600 hover:text-red-700 transition"
            >
                <X className="w-5 h-5" />
            </button>

            <EditableField label="Nom complet" value={localParent.name} onChange={(v) => setLocalParent(prev => ({ ...prev, name: v }))} />
            <EditableField label="Téléphone" value={localParent.phone} onChange={(v) => setLocalParent(prev => ({ ...prev, phone: v }))} />
            <EditableField label="Email" value={localParent.email} onChange={(v) => setLocalParent(prev => ({ ...prev, email: v }))} />


        </div>
    );
}
