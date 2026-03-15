export const validateStudent = (student) => {
  const errors = {};

  /* ================================
     🔹 VALIDATION INFORMATIONS ÉLÈVE
  ================================== */

  if (!student.first_name?.trim()) {
    errors.first_name = ["Le prénom est requis."];
  }

  if (!student.last_name?.trim()) {
    errors.last_name = ["Le nom est requis."];
  }

  if (!student.birth_date) {
    errors.birth_date = ["La date de naissance est requise."];
  }

  if (!student.address?.trim()) {
    errors.address = ["L'adresse est requise."];
  }

  if (!student.city?.trim()) {
    errors.city = ["La ville est requise."];
  }

  if (!student.postal_code?.trim()) {
    errors.postal_code = ["Le code postal est requis."];
  }

  if (!student.phone?.trim()) {
    errors.phone = ["Le numéro de téléphone est requis."];
  }

  if (!student.grade_level?.trim()) {
    errors.grade_level = ["Le niveau scolaire est requis."];
  }

  /* ================================
     🔹 VALIDATION GUARDIANS
  ================================== */

  const guardianData = student.guardians_data || {};
 // console.log("Validating guardians data:", guardianData);

  const guardianIds = [
    ...new Set(
      Object.keys(guardianData)
        .map(key => key.match(/^guardian_(\d+)_/))
        .filter(Boolean)
        .map(match => match[1])
    )
  ];

  guardianIds.forEach(id => {
    const name = guardianData[`guardian_${id}_name`] || "";
    const relationship = guardianData[`guardian_${id}_relationship`] || "";
    const phone = guardianData[`guardian_${id}_phone`] || "";
    const email = guardianData[`guardian_${id}_email`] || "";

    // 🚨 IMPORTANT :
    // Si le guardian existe (donc id détecté),
    // alors il DOIT être rempli correctement

    if (!name.trim()) {
      errors[`guardian_${id}_name`] = [
        "Le nom du responsable est requis."
      ];
    }

    if (!relationship.trim()) {
      errors[`guardian_${id}_relationship`] = [
        "Le lien de parenté est requis."
      ];
    }

    if (!phone.trim()) {
      errors[`guardian_${id}_phone`] = [
        "Le téléphone est requis."
      ];
    }

    // Email facultatif (si tu veux le rendre obligatoire dis-le)
  });

  //console.log("Validation errors:", errors);

  return errors;
};
