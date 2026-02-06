import { useState } from "react";
import Section from "./section";
import EditableField from "../Edit/EditableField";
import { Plus, X, Check } from "lucide-react";

export default function SectionParents({ student, onChange,updateStudentField }) {

  const MAX_GUARDIANS = 4;

  const guardiansCount = student.guardians?.length || 0;

  // 🆕 formulaire temporaire
  const [showForm, setShowForm] = useState(false);
  const [newParent, setNewParent] = useState({
    first_name: "",
    relationship: "",
    phone: "",
    email: "",
    profession: "",
  });

  // ❌ supprimer parent existant
  const removeParent = (id) => {
    onChange(
      "guardians",
      (student.guardians || []).filter(p => p.id !== id)
    );
  };

  // ➕ valider ajout
  const saveParent = () => {
    if (guardiansCount >= MAX_GUARDIANS) return;

    onChange("guardians", [
      ...(student.guardians || []),
      { id: Date.now(), ...newParent }
    ]);

    setNewParent({
      first_name: "",
      relationship: "",
      phone: "",
      email: "",
      profession: "",
    });
    setShowForm(false);
  };

  return (
    <Section title="Informations Parents">
      <div className="space-y-6">

        {/* 🔽 PARENTS EXISTANTS */}
        {student.guardians?.length > 0 ? (
          student.guardians.map((parent, index) => (
            <div
              key={parent.id}
              className="p-6 border rounded-md bg-gray-50 relative"
            >
              <span className="absolute top-2 left-2 text-xs text-gray-500">
                Parent {index + 1}
              </span>

              <button
                type="button"
                onClick={() => removeParent(parent.id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                aria-label="Supprimer ce parent"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <EditableField
                field="Prénom"
                    label="Prénom"
                    value={parent.name}
                    student={student}
                    updateStudentField={updateStudentField}
                />

                <EditableField
                  label="Relation"
                  value={parent.relationship}
                  editing={true}
                  onChange={(val) =>
                    onChange(
                      "guardians",
                      student.guardians.map(p =>
                        p.id === parent.id
                          ? { ...p, relationship: val }
                          : p
                      )
                    )
                  }
                />

                <EditableField
                  label="Téléphone"
                  value={parent.phone}
                  editing={true}
                  onChange={(val) =>
                    onChange(
                      "guardians",
                      student.guardians.map(p =>
                        p.id === parent.id
                          ? { ...p, phone: val }
                          : p
                      )
                    )
                  }
                />

                <EditableField
                  label="Email"
                  value={parent.email}
                  editing={true}
                  onChange={(val) =>
                    onChange(
                      "guardians",
                      student.guardians.map(p =>
                        p.id === parent.id
                          ? { ...p, email: val }
                          : p
                      )
                    )
                  }
                />

                <EditableField
                  label="Profession"
                  value={parent.profession}
                  editing={true}
                  onChange={(val) =>
                    onChange(
                      "guardians",
                      student.guardians.map(p =>
                        p.id === parent.id
                          ? { ...p, profession: val }
                          : p
                      )
                    )
                  }
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">
            Aucun parent ou tuteur ajouté.
          </p>
        )}

        {/* ➕ BOUTON AJOUT */}
        {!showForm && (
          <div>
            <button
              type="button"
              disabled={guardiansCount >= MAX_GUARDIANS}
              onClick={() => setShowForm(true)}
              className={`px-4 py-2 rounded flex items-center gap-2
                ${guardiansCount >= MAX_GUARDIANS
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
                }`}
            >
              <Plus size={16} />
              Ajouter un parent / tuteur
            </button>

            {guardiansCount >= MAX_GUARDIANS && (
              <p className="text-sm text-red-600 mt-1">
                Maximum {MAX_GUARDIANS} parents / tuteurs autorisés.
              </p>
            )}
          </div>
        )}

        {/* 🆕 FORMULAIRE NOUVEAU PARENT */}
        {showForm && (
          <div className="p-6 border-2 border-dashed rounded-lg bg-white space-y-4">
            <h3 className="font-semibold">
              Nouveau parent ({guardiansCount + 1}/{MAX_GUARDIANS})
            </h3>

            <input
              placeholder="Prénom"
              value={newParent.first_name}
              onChange={(e) =>
                setNewParent({ ...newParent, first_name: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />

            <input
              placeholder="Relation"
              value={newParent.relationship}
              onChange={(e) =>
                setNewParent({ ...newParent, relationship: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />

            <input
              placeholder="Téléphone"
              value={newParent.phone}
              onChange={(e) =>
                setNewParent({ ...newParent, phone: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />

            <input
              placeholder="Email"
              type="email"
              value={newParent.email}
              onChange={(e) =>
                setNewParent({ ...newParent, email: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />

            <input
              placeholder="Profession"
              value={newParent.profession}
              onChange={(e) =>
                setNewParent({ ...newParent, profession: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={saveParent}
                className="px-4 py-2 bg-red-600 text-white rounded flex items-center gap-2"
              >
                <Check size={16} />
                Ajouter
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

      </div>
    </Section>
  );
}
