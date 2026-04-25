import { useState, useEffect, useRef, useContext } from "react";
import Section from "./section";
import EditableField from "../Edit/EditableField";
import { Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { updateStudentApi } from "../../../api/apistudents"; // ⚡ API pour sauvegarde
import { AppContext } from "../../../Context/AppContext";

export default function SectionParents({ student, updateStudentField }) {
  const { token } = useContext(AppContext);
  const [parents, setParents] = useState(student.guardians || []);
  const saveTimeout = useRef(null);

  // ⚡ Synchronisation si student.guardians change
  useEffect(() => {
    setParents(student.guardians || []);
  }, [student.guardians]);

  // 🔹 Sauvegarde parents sur le backend avec debounce
  const saveParentsDebounced = (newParents) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      try {
        console.log("token in saveParentsDebounced", token);
        const updatedStudent = await updateStudentApi(student.id, { guardians: newParents });
        updateStudentField(updatedStudent, "Parents sauvegardés !");
      } catch (error) {
        console.error(error);
        if (error.errors) {
          const errorMessages = Object.values(error.errors).flat().join(", ");
          toast.error(errorMessages || "Erreur lors de la sauvegarde !");
        } else {
          toast.error("Erreur lors de la sauvegarde !");
        }
      }
    }, 500); // ⚡ 0.5s après la dernière modification
  };

  // 🔹 Met à jour uniquement le nom d’un parent
  const handleUpdateParentName = (index, value) => {
    const newParents = [...parents];
    newParents[index] = {
      ...newParents[index],
      name: value,
      student_id: student.id,
      id: newParents[index].id || null
    };
    setParents(newParents);
    saveParentsDebounced(newParents);
  };

  // 🔹 Met à jour un champ d’un parent
  const handleUpdateParentField = (index, field, value) => {
    const newParents = [...parents];
    newParents[index] = {
      ...newParents[index],
      [field]: value,
      student_id: student.id,
      id: newParents[index].id || null
    };
    setParents(newParents);
    saveParentsDebounced(newParents);
  };

  // 🔹 Ajouter un parent vide
  const handleAddParent = () => {
    const newParents = [...parents, { name: "", student_id: student.id }];
    setParents(newParents);
    saveParentsDebounced(newParents);
    toast.success("Parent ajouté !");
  };

  // 🔹 Supprimer un parent avec confirmation
  const handleRemoveParent = (index) => {
    const parentName = parents[index].name || "ce parent";
    if (!confirm(`Voulez-vous vraiment supprimer ${parentName} ?`)) return;
    const newParents = parents.filter((_, i) => i !== index);
    setParents(newParents);
    saveParentsDebounced(newParents);
    toast.success("Parent supprimé !");
  };

  return (
    <Section title="Parents">
      <div className="grid grid-cols-1 gap-4">
        {parents.map((parent, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2 p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
          >
            {/* 🔹 Champ éditable pour le nom */}
            <EditableField
              label="Nom"
              value={parent.name}
              onChange={(value) => handleUpdateParentName(index, value)}
              className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 focus:outline-none"
            />

            {/* 🔹 Champ éditable pour le prénom */}
            <EditableField
              label="Prénom"
              value={parent.first_name || ""}
              onChange={(value) => handleUpdateParentField(index, "first_name", value)}
              className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 focus:outline-none"
            />

            {/* 🔹 Champ éditable pour la relation */}
            <EditableField
              label="Relation"
              value={parent.relationship || ""}
              onChange={(value) => handleUpdateParentField(index, "relationship", value)}
              className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 focus:outline-none"
            />

            {/* 🔹 Bouton supprimer parent – rouge moderne */}
            <button
              onClick={() => handleRemoveParent(index)}
              title="Supprimer ce parent"
              className="p-2 text-red-500 hover:text-red-700 rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        ))}

        {/* 🔹 Bouton ajouter un parent – vert moderne */}
        <button
          onClick={handleAddParent}
          className="flex items-center gap-1 mt-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus size={18} /> Ajouter un parent
        </button>
      </div>
    </Section>
  );
}
