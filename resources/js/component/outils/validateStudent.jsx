// resources/js/component/outils/validateStudent.js
export function validateStudent(student) {
  const errors = {};

  // --- Informations personnelles ---
  if (!student.firstName || student.firstName.trim() === "") {
    errors.firstName = ["Prénom requis"];
  }

  if (!student.lastName || student.lastName.trim() === "") {
    errors.lastName = ["Nom requis"];
  }

  if (!student.birthDate || student.birthDate.trim() === "") {
    errors.birthDate = ["Date de naissance requise"];
  }

  if (!student.gender || !["male", "female"].includes(student.gender)) {
    errors.gender = ["Genre requis"];
  }

  if (student.postalCode && !/^\d{3,10}$/.test(student.postalCode)) {
    errors.postalCode = ["Code postal invalide"];
  }

  if (!student.city || student.city.trim() === "") {
    errors.city = ["Ville requise"];
  }

  if (!student.address || student.address.trim() === "") {
    errors.address = ["Adresse requise"];
  }

  if (!student.phone || !/^\+?\d{8,15}$/.test(student.phone)) {
    errors.phone = ["Numéro de téléphone invalide"];
  }

  // --- Académique ---
  if (!student.gradeLevel || student.gradeLevel.trim() === "") {
    errors.gradeLevel = ["Niveau requis"];
  }



  // --- Paiement ---
  if (!student.tuitionPayment || typeof student.tuitionPayment !== "object") {
    errors.tuitionPayment = ["Statut de paiement requis"];
  } else {
    const { registration_status, paid_months } = student.tuitionPayment;

    if (!["not_paid", "half", "full"].includes(registration_status)) {
      errors.tuitionPayment = ["Statut de paiement invalide"];
    }
  }

  // --- Image étudiant (optionnel) ---
  if (student.studentImage) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(student.studentImage.type)) {
      errors.studentImage = ["Format d'image invalide (jpg, jpeg, png)"];
    }

    const maxSize = 2 * 1024 * 1024; // 2 Mo
    if (student.studentImage.size > maxSize) {
      errors.studentImage = ["Taille de l'image trop grande (max 2Mo)"];
    }
  }

  console.log("Validation errors:", errors);
  return errors;
}
