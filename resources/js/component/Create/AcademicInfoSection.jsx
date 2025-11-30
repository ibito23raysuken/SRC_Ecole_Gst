// resources/js/component/Create/AcademicInfoSection.jsx
import React from "react";

export default function AcademicInfoSection({ student, handleChange }) {
  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6 pb-2 border-b border-gray-200">
        Informations académiques
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            École précédente
          </label>
          <input
            name="previous_school"
            value={student.previous_school || ""}
            placeholder="Nom de l'école"
            onChange={handleChange}
            className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Classe précédente
          </label>
          <input
            name="previous_class"
            value={student.previous_class || ""}
            placeholder="Classe précédente"
            onChange={handleChange}
            className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau actuel
          </label>
          <input
            name="grade_level"
            value={student.grade_level || ""}
            placeholder="CP, CE1, BEP..."
            onChange={handleChange}
            className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>
      </div>
    </div>
  );
}
