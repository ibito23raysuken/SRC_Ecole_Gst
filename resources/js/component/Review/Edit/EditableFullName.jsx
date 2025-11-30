import { useState } from 'react';
import { Edit3, Save } from "lucide-react";
import { updateStudentApi } from '../../../api/apistudents';
import {  useContext } from 'react';
import { AppContext } from '../../../Context/AppContext';


export default function EditableFullName({ student, setStudent }) {
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(student.first_name);
  const [lastName, setLastName] = useState(student.last_name);
  const [error, setError] = useState("");
  const { token } = useContext(AppContext);
  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Le nom et le prénom ne peuvent pas être vides.");
      return;
    }

    try {
      // MAJ front immédiate
      setStudent(prev => ({
        ...prev,
        firstName,
        lastName
      }));

      // MAJ backend
      await updateStudentApi(student.id, {
        first_name: firstName,
        last_name: lastName
      },token);

      setEditing(false);
      setError("");

    } catch (e) {
      console.error("Erreur lors de la sauvegarde :", e);
      setError("Erreur lors de la sauvegarde.");
    }
  };

  return (
    <div>
      {!editing ? (
        <div className="flex justify-between items-center">
          <p className="text-3xl font-bold text-red-600">
            {student.firstName} {student.lastName}
          </p>
          <button onClick={() => setEditing(true)} className="text-red-600 px-3">
            <Edit3 className="w-10 h-10" />
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={firstName}
              placeholder="Prénom"
              onChange={(e) => setFirstName(e.target.value)}
              className="border border-gray-200 rounded-lg p-4"
            />
            <input
              type="text"
              value={lastName}
              placeholder="Nom"
              onChange={(e) => setLastName(e.target.value)}
              className="border border-gray-200 rounded-lg p-4"
            />
          </div>

          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          <div className="flex justify-end gap-3">
            <button onClick={() => setEditing(false)} className="bg-gray-500 text-white px-3 py-1 rounded">
              Annuler
            </button>
            <button onClick={handleSave} className="px-3 py-1 bg-red-600 text-white rounded-md">
              <Save className="w-4 h-4 inline-block mr-1" />
              Sauvegarder
            </button>
          </div>
        </>
      )}
    </div>
  );
}
