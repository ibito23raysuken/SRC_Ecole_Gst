// DocumentsSection.jsx
import { useState, useEffect, useContext,React} from 'react';
import Section from "../Section/section";
import EditableField from "../Edit/EditableField";
import { Edit3, Save } from "lucide-react";
export default function SectionDocuments({ student, setStudent }) {
    return (
        <Section title="Documents">
            <div className="space-y-3">
                {student.dossier &&
                    Object.entries(student.dossier).map(([key, status]) => (
                        <EditableDocument
                            key={key}
                            label={key}
                            status={status}
                            onSave={(newValue) => {
                                setStudent(prev => {
                                    const updated = {
                                        ...prev,
                                        dossier: {
                                            ...prev.dossier,
                                            [key]: newValue
                                        }
                                    };
                                    console.log(`Document "${key}" mis à jour →`, newValue);
                                    return updated;
                                });
                            }}
                        />
                    ))
                }
            </div>
        </Section>
    );
}
// Document éditable
function EditableDocument({ label, status, onSave }) {
    const [editing, setEditing] = useState(false);
    const [checked, setChecked] = useState(status);

    const handleSave = () => {
        setEditing(false);
        onSave(checked);
        console.log(`Document "${label}" mis à jour :`, checked);
    };

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                {editing ? (
                    <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
                ) : (
                    <div className={`w-5 h-5 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                )}
                <span className={`${status ? 'text-green-700' : 'text-red-700'}`}>{label}</span>
            </div>
            <button onClick={editing ? handleSave : () => setEditing(true)} className={`ml-2 font-bold ${editing ? 'text-green-600' : 'text-red-600'}`}>
                {editing ? <Save className="w-5 h-5 mr-2" /> : <Edit3 className="w-5 h-5 mr-2" />}
            </button>
        </div>
    );
}



