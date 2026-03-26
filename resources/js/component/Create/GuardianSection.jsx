import React, { useState, useEffect } from "react";

export default function GuardianSection({
  student,
  handleChange,
  errors = {},
  setStudent
}) {
  const [guardians, setGuardians] = useState([]);

  // ===============================
  // CONSTANTES RELATIONSHIPS
  // ===============================
  const RELATIONSHIPS = [
    { value: "father", label: "Père" },
    { value: "mother", label: "Mère" },
    { value: "guardian", label: "Tuteur légal" },
  ];

  // ===============================
  // PRÉ-REMPLIR GUARDIANS EXISTANTS
  // ===============================
  useEffect(() => {
    const keys = Object.keys(student.guardians_data || {});
    const ids = keys
      .map((k) => k.match(/^guardian_(\d+)_/))
      .filter(Boolean)
      .map((m) => parseInt(m[1], 10));

    const uniqueIds = [...new Set(ids)];
    setGuardians(uniqueIds.map((id) => ({ id })));
  }, [student.guardians_data]);

  // ===============================
  // AJOUTER GUARDIAN
  // ===============================
  const addGuardian = () => {
    if (guardians.length >= 4) return;

    const existingIds = guardians.map((g) => g.id);
    let newId = 1;
    while (existingIds.includes(newId)) newId++;

    setGuardians([...guardians, { id: newId }]);

    // Initialiser champs contrôlés
    ["name", "relationship", "phone", "email", "profession", "country_code"]
      .forEach((field) => {
        handleChange({
          target: {
            name: `guardian_${newId}_${field}`,
            value: field === "country_code" ? "+261" : "",
            type: "text"
          }
        });
      });
  };

  // ===============================
  // SUPPRIMER GUARDIAN
  // ===============================
  const removeGuardian = (id) => {
    setGuardians((prev) => prev.filter((g) => g.id !== id));

    setStudent((prev) => {
      const newGuardians = { ...prev.guardians_data };
      Object.keys(newGuardians).forEach((key) => {
        if (key.startsWith(`guardian_${id}_`)) {
          delete newGuardians[key];
        }
      });
      return { ...prev, guardians_data: newGuardians };
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          Responsables légaux ({guardians.length}/4)
        </h2>
      </div>

      {guardians.length === 0 && (
        <div className="text-center py-2 bg-gray-50 rounded-lg border border-gray-200">
          Aucun responsable légal ajouté.
        </div>
      )}

      {guardians.map(({ id }) => {
        const getError = (field) => errors[`guardian_${id}_${field}`];

        return (
          <div key={id} className="border rounded-lg mb-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold">
                  {id}
                </div>
                <span className="font-medium text-gray-700">
                  Responsable {id}
                </span>
              </div>

              <button
                type="button"
                onClick={() => removeGuardian(id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-md"
              >
                Supprimer
              </button>
            </div>

            {/* Fields */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nom complet
                </label>
                <input
                  name={`guardian_${id}_name`}
                  value={student.guardians_data?.[`guardian_${id}_name`] ?? ""}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    getError("name") ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {getError("name") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("name")[0]}
                  </p>
                )}
              </div>

              {/* Lien */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Lien de parenté
                </label>
                <select
                  name={`guardian_${id}_relationship`}
                  value={student.guardians_data?.[`guardian_${id}_relationship`] ?? ""}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    getError("relationship") ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Sélectionnez</option>
                  {RELATIONSHIPS.map(r => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {getError("relationship") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("relationship")[0]}
                  </p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Téléphone *
                </label>

                <div className="flex gap-2">
                  <select
                    name={`guardian_${id}_country_code`}
                    value={
                      student.guardians_data?.[`guardian_${id}_country_code`] ?? "+261"
                    }
                    onChange={handleChange}
                    className="px-2 py-2 border rounded-lg w-24"
                  >
                    <option value="+261">+261 (MG)</option>
                    <option value="+33">+33 (FR)</option>
                    <option value="+1">+1 (US)</option>
                  </select>

                  <input
                    type="tel"
                    name={`guardian_${id}_phone`}
                    value={
                      student.guardians_data?.[`guardian_${id}_phone`] ?? ""
                    }
                    placeholder="XX-XX-XXX-XX"
                    onChange={handleChange}
                    className={`flex-1 px-3 py-2 border rounded-lg ${
                      getError("phone") ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>

                {getError("phone") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("phone")[0]}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name={`guardian_${id}_email`}
                  value={student.guardians_data?.[`guardian_${id}_email`] ?? ""}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    getError("email") ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {getError("email") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("email")[0]}
                  </p>
                )}
              </div>

              {/* Profession */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Profession
                </label>
                <input
                  name={`guardian_${id}_profession`}
                  value={student.guardians_data?.[`guardian_${id}_profession`] ?? ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

            </div>
          </div>
        );
      })}

      {/* Add guardian */}
      <button
        type="button"
        onClick={addGuardian}
        disabled={guardians.length >= 4}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg disabled:bg-gray-400"
      >
        {guardians.length === 0
          ? "Ajouter le premier responsable"
          : "Ajouter un responsable"}
      </button>
    </div>
  );
}
