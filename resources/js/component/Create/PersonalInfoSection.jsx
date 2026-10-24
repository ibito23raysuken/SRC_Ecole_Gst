import React, { useState, useEffect } from "react";

export default function PersonalInfoSection({
  student,
  handleChange,
  errors = {},
}) {
  const [preview, setPreview] = useState(null);

  // Date maximale autorisée : aujourd'hui
  const today = new Date();
  const maxBirthDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // Vérification complémentaire de la date de naissance
  const birthDateError =
    student.birth_date && student.birth_date >= maxBirthDate
      ? "La date de naissance doit être antérieure à aujourd'hui."
      : null;

  // Gérer l'aperçu de l'image
  const handleImage = (e) => {
    const file = e.target.files?.[0];

    handleChange(e);

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return imageUrl;
      });
    } else {
      setPreview((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return null;
      });
    }
  };

  // Libérer l'URL de l'image lorsque le composant est démonté
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Afficher les erreurs
  const renderError = (fieldName) => {
    const message =
      fieldName === "birth_date" && birthDateError
        ? birthDateError
        : errors[fieldName]?.[0];

    return message ? (
      <p className="mt-1 text-sm text-red-600" role="alert">
        {message}
      </p>
    ) : null;
  };

  // Classes des champs
  const inputClassName = (fieldName) =>
    `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 ${
      (fieldName === "birth_date" && birthDateError) || errors[fieldName]
        ? "border-red-500"
        : "border-gray-300"
    }`;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-red-800 mb-6 pb-3 border-b border-gray-200">
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
                  alt="Aperçu de la photo de l'élève"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
            <span className="block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium text-center shadow-md">
              Sélectionner une image
            </span>
            <input
              type="file"
              name="student_image"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </label>

          {renderError("student_image")}
        </div>

        {/* Informations personnelles */}
        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <input
              type="text"
              name="first_name"
              value={student.first_name || ""}
              placeholder="Entrez le prénom"
              onChange={handleChange}
              required
              className={inputClassName("first_name")}
            />
            {renderError("first_name")}
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              name="last_name"
              value={student.last_name || ""}
              placeholder="Entrez le nom"
              onChange={handleChange}
              required
              className={inputClassName("last_name")}
            />
            {renderError("last_name")}
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de naissance *
            </label>
            <input
              type="date"
              name="birth_date"
              value={student.birth_date || ""}
              max={maxBirthDate}
              onChange={handleChange}
              required
              aria-invalid={Boolean(birthDateError || errors.birth_date)}
              className={inputClassName("birth_date")}
            />
            {renderError("birth_date")}
          </div>

          {/* Lieu de naissance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu de naissance
            </label>
            <input
              type="text"
              name="birth_place"
              value={student.birth_place || ""}
              placeholder="Ville / Pays"
              onChange={handleChange}
              className={inputClassName("birth_place")}
            />
            {renderError("birth_place")}
          </div>

          {/* Nationalité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationalité
            </label>
            <input
              type="text"
              name="nationality"
              value={student.nationality || ""}
              placeholder="Nationalité"
              onChange={handleChange}
              className={inputClassName("nationality")}
            />
            {renderError("nationality")}
          </div>

          {/* Genre */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Genre *
            </label>

            <div className="flex gap-6">
              {[
                { value: "male", label: "Homme" },
                { value: "female", label: "Femme" },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={value}
                    checked={student.gender === value}
                    onChange={handleChange}
                    required
                    className={`w-5 h-5 accent-red-600 ${
                      errors.gender ? "outline outline-1 outline-red-500" : ""
                    }`}
                  />
                  <span
                    className={
                      student.gender === value
                        ? "text-red-600 font-medium"
                        : "text-gray-700"
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
