// resources/js/component/Create/GuardianSection.jsx
import React, { useState } from "react";

export default function GuardianSection({ student, handleChange }) {
  const [guardians, setGuardians] = useState([]);

  const addGuardian = () => {
    if (guardians.length < 4) {
      const newId = guardians.length > 0 ? Math.max(...guardians.map(g => g.id)) + 1 : 1;
      setGuardians([...guardians, { id: newId }]);
    }
  };

  const removeGuardian = (id) => {
    if (guardians.length > 0) {
      setGuardians(guardians.filter(guardian => guardian.id !== id));
    }
  };

  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-bold text-gray-800">Responsables légaux</h2>
          <p className="text-sm text-gray-500 mt-1">
            {guardians.length}/4 responsables maximum
          </p>
        </div>
      </div>

      {/* Afficher un message si aucun responsable */}
      {guardians.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">Aucun responsable légal ajouté.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {guardians.map((guardian) => (
            <div key={guardian.id} className="border border-gray-200 rounded-lg">
              {/* En-tête du responsable */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    {guardian.id}
                  </div>
                  <span className="font-medium text-gray-700">
                    Responsable {guardian.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => removeGuardian(guardian.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors duration-200"
                    title="Supprimer ce responsable"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Champs du responsable */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    name={`guardian_${guardian.id}_name`}
                    value={student[`guardian_${guardian.id}_name`] || ""}
                    placeholder="Nom et prénom du responsable"
                    onChange={handleChange}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lien de parenté
                  </label>
                  <select
                    name={`guardian_${guardian.id}_relationship`}
                    value={student[`guardian_${guardian.id}_relationship`] || ""}
                    onChange={handleChange}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="">Sélectionnez le lien</option>
                    <option value="father">Père</option>
                    <option value="mother">Mère</option>
                    <option value="legal_guardian">Tuteur légal</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    name={`guardian_${guardian.id}_phone`}
                    value={student[`guardian_${guardian.id}_phone`] || ""}
                    placeholder="Téléphone du responsable"
                    onChange={handleChange}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name={`guardian_${guardian.id}_email`}
                    value={student[`guardian_${guardian.id}_email`] || ""}
                    placeholder="Email du responsable"
                    onChange={handleChange}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profession
                  </label>
                  <input
                    name={`guardian_${guardian.id}_profession`}
                    value={student[`guardian_${guardian.id}_profession`] || ""}
                    placeholder="Profession du responsable"
                    onChange={handleChange}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addGuardian}
        disabled={guardians.length >= 4}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        {guardians.length === 0 ? "Ajouter le premier responsable" : "Ajouter un responsable"}
      </button>
    </div>
  );
}
