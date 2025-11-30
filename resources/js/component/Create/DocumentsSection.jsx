// resources/js/component/Create/DocumentsSection.jsx
import React from "react";

export default function DocumentsSection({ student, handleChange }) {
  const documents = [
    { key: "birth_certificate", label: "Acte de naissance" },
    { key: "medical_certificate", label: "Certificat médical" },
    { key: "report_card", label: "Relevé de notes" },
    { key: "id_card", label: "Carte d'identité" },
  ];

  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6 pb-2 border-b border-gray-200">
        Documents fournis
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
        {documents.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            <input
              type="checkbox"
              name={key}
              checked={student[key] || false}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
