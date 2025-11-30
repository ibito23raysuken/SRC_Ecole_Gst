// resources/js/component/Create/NotesSection.jsx
import React from "react";

export default function NotesSection({ student, handleChange }) {
  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6 pb-2 border-b border-gray-200">
        Notes / Besoins spécifiques
      </h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Informations importantes
        </label>
        <textarea
          name="special_needs"
          value={student.special_needs || ""}
          placeholder="Notes importantes, besoins spécifiques, allergies, etc..."
          onChange={handleChange}
          className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 h-24 lg:h-32 resize-vertical"
        />
      </div>
    </div>
  );
}
