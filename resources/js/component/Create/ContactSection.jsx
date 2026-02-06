import React from "react";

export default function ContactSection({ student, handleChange, errors = {} }) {
  const renderError = (fieldName) =>
    errors[fieldName] ? (
      <p className="mt-1 text-sm text-red-600">{errors[fieldName][0]}</p>
    ) : null;

  const inputClassName = (fieldName) =>
    `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 ${
      errors[fieldName] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Contact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone *
          </label>
          <input
            name="phone"
            value={student.phone || ""}
            placeholder="Numéro de téléphone"
            onChange={handleChange}
            className={inputClassName("phone")}
          />
          {renderError("phone")}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse
          </label>
          <input
            name="address"
            value={student.address || ""}
            placeholder="Adresse complète"
            onChange={handleChange}
            className={inputClassName("address")}
          />
          {renderError("address")}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ville
          </label>
          <input
            name="city"
            value={student.city || ""}
            placeholder="Ville"
            onChange={handleChange}
            className={inputClassName("city")}
          />
          {renderError("city")}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code postal
          </label>
          <input
            name="postalCode"
            value={student.postalCode || ""}
            placeholder="Code postal"
            onChange={handleChange}
            className={inputClassName("postalCode")}
          />
          {renderError("postalCode")}
        </div>
      </div>
    </div>
  );
}
