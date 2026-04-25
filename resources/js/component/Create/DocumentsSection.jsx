// DocumentsSection.jsx
import React from "react";

export default function DocumentsSection({ student, handleChange, errors }) {
  const documents = [
    { key: "birth_certificate", label: "Acte de naissance" },
    { key: "medical_certificate", label: "Certificat médical" },
    { key: "residence_certificate", label: "Certificat de résidence" },
    { key: "report_card", label: "Relevé de notes" },
  ];

  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6 pb-2 border-b border-gray-200">
        Documents fournis
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
        {documents.map(({ key, label }) => (
          <div key={key}>
            <label
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors duration-200 cursor-pointer
                ${errors[key] ? "border-red-500 bg-red-50" : "border-gray-200 hover:bg-gray-50"}
              `}
            >
              <input
                type="checkbox"
                name={key}
                checked={student[key] || false}
                onChange={handleChange} // <-- ici
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{label}</span>
            </label>
            {errors[key] && (
              <p className="text-red-500 text-sm mt-1">{errors[key][0]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
