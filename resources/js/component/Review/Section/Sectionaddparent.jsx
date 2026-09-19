import { useState, useEffect, useRef, useContext } from "react";
import Section from "./section";
import EditableField from "../Edit/EditableField";
import { Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";

export default function SectionParents({ student, updateStudentField }) {
  const { token } = useContext(AppContext);

  const parents = student.guardians || [];

  const saveTimeout = useRef(null);

  // ===============================
  // DEBOUNCE SAVE
  // ===============================
  const saveParentsDebounced = (newParents) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      try {
        const updatedStudent = await updateStudentApi(student.id, {
          guardians: newParents,
        });
        updateStudentField(updatedStudent, "Parents sauvegardés !");
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de la sauvegarde !");
      }
    }, 1000);
  };

  // ===============================
  // UPDATE
  // ===============================
  const updateParent = (index, updates) => {
    const newParents = [...parents];
    newParents[index] = {
      ...newParents[index],
      ...updates,
    };

    updateStudentField({ ...student, guardians: newParents }, null);
    saveParentsDebounced(newParents);
  };

  // ===============================
  // ADD ← FIX : id stable avec crypto.randomUUID()
  // ===============================
  const [showAddParentForm, setShowAddParentForm] = useState(false);
  const [newParent, setNewParent] = useState({ name: "", first_name: "", relationship: "" });

  const handleAddParent = () => {
    setShowAddParentForm(true);
  };

  const handleSaveParent = (newParent) => {
    if (!newParent.name || !newParent.first_name || !newParent.relationship) {
      toast.error("Tous les champs doivent être remplis.");
      return;
    }

    const newParents = [
      ...parents,
      { id: crypto.randomUUID(), ...newParent },
    ];

    updateStudentField(
      { ...student, guardians: newParents },
      "Parent ajouté !"
    );

    saveParentsDebounced(newParents);
    setShowAddParentForm(false); // Fermer le formulaire après l'ajout
    setNewParent({ name: "", first_name: "", relationship: "" }); // Réinitialiser le formulaire
  };

  const handleCancelAddParent = () => {
    setShowAddParentForm(false);
  };

  // ===============================
  // REMOVE
  // ===============================
  const handleRemoveParent = (index) => {
    const parentName = parents[index]?.name || "ce parent";

    if (!window.confirm(`Supprimer ${parentName} ?`)) return;

    const newParents = parents.filter((_, i) => i !== index);

    updateStudentField(
      { ...student, guardians: newParents },
      "Parent supprimé !"
    );

    saveParentsDebounced(newParents);
  };

  return (
    <Section title="">
      <div className="bg-white p-6 rounded-2xl shadow-md border">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Parents / Responsables</h2>
          </div>
          <div className="px-3 py-1 bg-gray-100 rounded-full">
            {parents.length}
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {parents.map((parent, index) => (
            // ← FIX : key stable sur parent.id, fallback index pour anciens enregistrements
            <div key={parent.id || index} className="border p-4 rounded-xl">

              {/* TOP */}
              <div className="flex justify-between mb-3">
                <span>Parent {index + 1}</span>
                <button
                  onClick={() => handleRemoveParent(index)}
                  className="text-red-500"
                >
                  <X size={18} />
                </button>
              </div>

              {/* FIELDS */}
              <div className="grid md:grid-cols-3 gap-3">

                <EditableField
                  label="Nom"
                  value={parent.name}
                  onChange={(v) => updateParent(index, { name: v })}
                />

                <EditableField
                  label="Prénom"
                  value={parent.first_name}
                  onChange={(v) => updateParent(index, { first_name: v })}
                />

                <EditableField
                  label="Relation"
                  value={parent.relationship}
                  onChange={(v) => updateParent(index, { relationship: v })}
                />

              </div>
            </div>
          ))}
        </div>

        {/* ADD */}
        <button
          onClick={handleAddParent}
          className="mt-6 w-full bg-red-500 text-white py-3 rounded-xl"
        >
          Ajouter un parent
        </button>

        {/* FORMULAIRE D'AJOUT DE PARENT */}
        {showAddParentForm && (
          <div className="border p-4 rounded-xl bg-gray-50">
            <h3 className="text-lg font-bold mb-4">Ajouter un parent</h3>

            <div className="grid md:grid-cols-3 gap-3">
              <EditableField
                label="Nom"
                value={newParent.name}
                onChange={(v) => setNewParent((prev) => ({ ...prev, name: v }))}
              />

              <EditableField
                label="Prénom"
                value={newParent.first_name}
                onChange={(v) => setNewParent((prev) => ({ ...prev, first_name: v }))}
              />

              <EditableField
                label="Relation"
                value={newParent.relationship}
                onChange={(v) => setNewParent((prev) => ({ ...prev, relationship: v }))}
              />
            </div>

            <div className="flex flex-col md:flex-row justify-end mt-4 gap-2">
              <button
                onClick={() => handleSaveParent(newParent)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Sauvegarder
              </button>
              <button
                onClick={handleCancelAddParent}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
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
