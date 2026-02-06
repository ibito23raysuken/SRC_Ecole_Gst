// resources/js/component/Create/AcademicInfoSection.jsx
import React from "react";

export default function AcademicInfoSection({ student, handleChange, errors }) {
  const gradeLevels = [
    "PS", "MS", "GS", "CP", "CE1", "CE2", "CM1", "CM2",
    "6e", "5e", "4e", "3e", "2nde", "1ère", "Term"
  ];

  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6 pb-2 border-b border-gray-200">
        Informations académiques
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">

        {/* École précédente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            École précédente
          </label>
          <input
            name="previous_school"
            value={student.previous_school || ""}
            placeholder="Nom de l'école"
            onChange={handleChange}
            className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg transition-all duration-200
              ${errors.previous_school ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}
            `}
          />
          {errors.previous_school && (
            <p className="text-red-500 text-sm mt-1">{errors.previous_school[0]}</p>
          )}
        </div>

        {/* Classe précédente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Classe précédente
          </label>
          <input
            name="previous_class"
            value={student.previous_class || ""}
            placeholder="Classe précédente"
            onChange={handleChange}
            className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg transition-all duration-200
              ${errors.previous_class ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}
            `}
          />
          {errors.previous_class && (
            <p className="text-red-500 text-sm mt-1">{errors.previous_class[0]}</p>
          )}
        </div>

        {/* Niveau actuel */}
        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau actuel <span className="text-red-500">*</span>
          </label>
          <select
            name="gradeLevel"
            value={student.gradeLevel || ""}
            onChange={handleChange}
            className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg transition-all duration-200
              ${errors.gradeLevel ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}
            `}
          >
            <option value="">-- Sélectionner un niveau --</option>
            {gradeLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {errors.gradeLevel && (
            <p className="text-red-500 text-sm mt-1">{errors.gradeLevel[0]}</p>
          )}
        </div>

      </div>
    </div>
  );
}
