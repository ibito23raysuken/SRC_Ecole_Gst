import React, { useState } from "react";

export default function PersonalInfoSection({ student, handleChange, errors = {} }) {
  const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
    handleChange(e);
    const file = e.target.files && e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

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
        Informations personnelles
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Photo de profil */}
        <div className="lg:w-1/4 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Aperçu de la photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </div>
          </div>

          <label className="cursor-pointer">
            <div className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200 text-sm font-medium text-center shadow-md">
              Sélectionner une image
            </div>
            <input
              type="file"
              name="studentImage"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </label>
          {renderError("studentImage")}
        </div>

        {/* Informations */}
        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <input
              name="firstName"
              value={student.firstName}
              placeholder="Entrez le prénom"
              onChange={handleChange}
              className={inputClassName("firstName")}
            />
            {renderError("firstName")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              name="lastName"
              value={student.lastName}
              placeholder="Entrez le nom"
              onChange={handleChange}
              className={inputClassName("lastName")}
            />
            {renderError("lastName")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de naissance *
            </label>
            <input
              type="date"
              name="birthDate"
              value={student.birthDate}
              onChange={handleChange}
              className={inputClassName("birthDate")}
            />
            {renderError("birthDate")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu de naissance
            </label>
            <input
              name="birthPlace"
              value={student.birthPlace}
              placeholder="Ville / Pays"
              onChange={handleChange}
              className={inputClassName("birthPlace")}
            />
            {renderError("birthPlace")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationalité
            </label>
            <input
              name="nationality"
              value={student.nationality}
              placeholder="Nationalité"
              onChange={handleChange}
              className={inputClassName("nationality")}
            />
            {renderError("nationality")}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Genre *
            </label>
            <div className="flex gap-6">
              {[
                { value: "male", label: "Homme" },
                { value: "female", label: "Femme" },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={value}
                    checked={student.gender === value}
                    onChange={handleChange}
                    className={`w-5 h-5 appearance-none border-2 rounded-full checked:border-red-500 checked:bg-red-500 focus:outline-none ${
                      errors.gender ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <span
                    className={
                      student.gender === value ? "text-red-600 font-medium" : "text-gray-700"
                    }
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>
            {renderError("gender")}
          </div>
        </div>
      </div>
    </div>
  );
}
