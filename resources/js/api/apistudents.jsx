
export async function updateStudentApi(studentId, data, token) {
    console.log("updateStudentApi called with:", studentId, data.birth_place);

    const response = await fetch(`http://localhost:8000/api/students/${studentId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: (() => {
            // formData obligatoire si tu envoies potentiellement une image
            const formData = new FormData();

            formData.append("_method", "PATCH");

            if (data.first_name) formData.append("first_name", data.first_name);
            if (data.last_name) formData.append("last_name", data.last_name);
            if (data.academicYear) formData.append("academic_year", data.academicYear);
            if (data.gradeLevel) formData.append("grade_level", data.gradeLevel);
            if (data.birth_date) formData.append("birth_date", data.birth_date);
            if (data.birth_place) formData.append("birth_place", data.birth_place);
            if (data.gender) formData.append("gender", data.gender);
            if (data.nationality) formData.append("nationality", data.nationality);
            if (data.address) formData.append("address", data.address);
            if (data.city) formData.append("city", data.city);
            if (data.postal_code) formData.append("postal_code", data.postal_code);
            if (data.phone) formData.append("phone", data.phone);
            if (data.student_image) {
                formData.append("student_image", data.student_image);
            }

            return formData;
        })()
    });

    // Gestion des erreurs
    if (!response.ok) {
        let message = "Erreur lors de la sauvegarde";
        try {
            const err = await response.json();
            message = err.message || JSON.stringify(err) || message;
        } catch { }
        throw new Error(message);
    }

    // 👉 OBLIGATOIRE : renvoyer le JSON du backend
    return await response.json();
}


/**
 * getStudentsApi
 * Récupère tous les étudiants
 * @returns {Promise<Array>} - Liste des étudiants
 */
export async function getStudentsApi(id, token) {
    const response = await fetch(`http://localhost:8000/api/students/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de l'étudiant (HTTP ${response.status})`);
    }

    const data = await response.json();

    // Formatage directement ici
    return {
        ...data,
        firstName: data.first_name,
        lastName: data.last_name,
        birthDate: data.birth_date,
        birthPlace: data.birth_place,
        postalCode: data.postal_code,
        academicYear: data.academic_year,
        gradeLevel: data.grade_level,
        student_image: data.student_image,
        dossier: {
            birthCertificate: data.dossier?.birth_certificate || false,
            medicalCertificate: data.dossier?.medical_certificate || false,
            reportCard: data.dossier?.report_card || false,
            photo: data.dossier?.photo || false,
            idCard: data.dossier?.id_card || false,
        },
        paymentStatus: data.payment_status || 'inconnu',
        parents: data.parents || [],
        grades: data.grades || {},
        attendance: data.attendance || 0,
        documents: data.documents || []
    };
}

/**
 * createStudentApi
 * Crée un nouvel étudiant
 * @param {object} data - Données de l'étudiant { first_name, last_name }
 * @returns {Promise<object>} - Étudiant créé
 */
export async function createStudentApi(data) {
    const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de l\'étudiant');
    }

    return await response.json();
}

/**
 * deleteStudentApi
 * Supprime un étudiant
 * @param {number|string} studentId - ID de l'étudiant
 * @returns {Promise<void>}
 */
export async function deleteStudentApi(studentId) {
    const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression de l\'étudiant');
    }
}
