import React, { useState } from "react";

export default function ContactSection({ student, setStudent, errors = {} }) {
  const renderError = (fieldName) =>
    errors[fieldName] ? (
      <p className="mt-1 text-sm text-red-600">{errors[fieldName][0]}</p>
    ) : null;

  const inputClassName = (fieldName) =>
    `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 ${
      errors[fieldName] ? "border-red-500" : "border-gray-300"
    }`;

  // Formate pour l'affichage uniquement (ne modifie pas student.phone)
  const formatPhoneDisplay = (value) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");
    return digits.match(/.{1,2}/g)?.join("-") || digits;
  };

const handlePhoneChange = (e) => {
  let input = e.target.value.replace(/\D/g, ""); // Supprime tout sauf les chiffres
  input = input.substring(0, 9); // Limite à 9 chiffres (ex: 32448071)

  let formatted = "";
  const part1 = input.substring(0,2);
  const part2 = input.substring(2,4);
  const part3 = input.substring(4,7);
  const part4 = input.substring(7,9);

  if(part1) formatted += part1;
  if(part2) formatted += "-" + part2;
  if(part3) formatted += "-" + part3;
  if(part4) formatted += "-" + part4;
  setStudent(prev => ({
    ...prev,
    phone: formatted
  }));
};
console.log("ContactSection render, student.phone:", student.phone);
  const handleCountryCodeChange = (e) => {
    setStudent((prev) => ({ ...prev, country_code: e.target.value }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Contact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone *
          </label>
          <div className="flex gap-2">
            {/* Code pays */}
            <select
              name="country_code"
              value={student.country_code || "+261"}
              onChange={handleCountryCodeChange}
              className="px-1 py-2 border rounded-lg w-24"
            >
              <option value="+261">+261(MG)</option>
              <option value="+33">+33 (FR)</option>
              <option value="+1">+1 (US)</option>
            </select>

            {/* Numéro */}
            <input
              type="tel"
              name="phone"
              value={student.phone}
              placeholder="XX-XX-XXX-XX"
              onChange={handlePhoneChange}
              className={inputClassName("phone") + " flex-1"}
            />
          </div>
          {renderError("phone")}
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse
          </label>
          <input
            name="address"
            value={student.address || ""}
            placeholder="Adresse complète"
            onChange={(e) =>
              setStudent((prev) => ({ ...prev, address: e.target.value }))
            }
            className={inputClassName("address")}
          />
          {renderError("address")}
        </div>

        {/* Ville */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ville
          </label>
          <input
            name="city"
            value={student.city || ""}
            placeholder="Ville"
            onChange={(e) =>
              setStudent((prev) => ({ ...prev, city: e.target.value }))
            }
            className={inputClassName("city")}
          />
          {renderError("city")}
        </div>

        {/* Code postal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code postal
          </label>
          <input
            name="postal_code"
            value={student.postal_code || ""}
            placeholder="Code postal"
            onChange={(e) =>
              setStudent((prev) => ({ ...prev, postal_code: e.target.value }))
            }
            className={inputClassName("postal_code")}
          />
          {renderError("postal_code")}
        </div>
      </div>
    </div>
  );
}
