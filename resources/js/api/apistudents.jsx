import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { Accept: "application/json" }
});

/**
 * Convert Front → Back (camelCase → snake_case)
 */
export function mapToBackend(data) {
  const get = key => data.get(key) ?? null;

  const parseJSON = str => {
    try {
      return str ? JSON.parse(str) : null;
    } catch (e) {
      console.warn(`Impossible de parser ${str}`, e);
      return null;
    }
  };


  return {
    first_name: get("firstName"),
    last_name: get("lastName"),
    birth_date: get("birthDate"),
    birth_place: get("birthPlace"),
    gender: get("gender"),
    nationality: get("nationality"),
    address: get("address"),
    city: get("city"),
    postal_code: get("postalCode"),
    phone: get("phone"),
    previous_school: get("previousSchool"),
    previous_class: get("previousClass"),
    academic_year: get("academicYear"),
    grade_level: get("gradeLevel"),
    special_needs: get("specialNeeds"),

    dossier: parseJSON(get("dossier")) || {
      birthCertificate: false,
      medicalCertificate: false,
      reportCard: false,
      idCard: false,
    },

    tuition_payment: parseJSON(get("tuitionPayment")) || {
      registration_status: "not_paid",
      tuition_status: "not_paid",
      paid_months: [],
    },

    student_image: get("student_image"),
    parents: parseJSON(get("parents")) || [],
  };
}




/**
 * Convert Back → Front (snake_case → camelCase)
 */
function mapToFrontend(data) {
  return {
    ...data,
    firstName: data.first_name,
    lastName: data.last_name,
    birthDate: data.birth_date,
    birthPlace: data.birth_place,
    postalCode: data.postal_code,
    academicYear: data.academic_year,
    gradeLevel: data.grade_level,

    dossier: {
      birthCertificate: data.birth_certificate ?? false,
      medicalCertificate: data.medical_certificate ?? false,
      reportCard: data.report_card ?? false,
      idCard: data.id_card ?? false,
    },

    payment: {
      tuitionPayment: data.tuition_payment ?? false,
      registrationMonths: data.registration_months ?? [],
    },

    parents: data.parents ?? []
  };
}

/**
 * ➕ CREATE STUDENT
 */
export async function createStudentApi(data, token) {
    const payload = mapToBackend(data);
  const response = await api.post("/students", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  });

  return mapToFrontend(response.data);
}

/**
 * ✏️ UPDATE STUDENT (avec image)
 */


export async function updateStudentApi(studentId, data, token) {
  console.log("Payload sent:", data);

  const formData = new FormData();
  formData.append("_method", "PATCH");

  // Ajout dynamique des champs
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value)); // forcer string pour éviter 422
    }
  });

  // Debug : vérifier ce qui est envoyé
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  const response = await api.post(`/students/${studentId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  return response.data;
}




/**
 * 🔍 GET STUDENT BY ID
 */
export async function getStudentsApi(id, token) {
  const response = await api.get(`/students/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}
/**
 * 🔍 GET all STUDENT
 */
export async function getAllStudentsApi(token) {
  const response = await api.get('/students', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

/**
 * ❌ DELETE STUDENT
 */
export async function deleteStudentApi(studentId, token) {
  await api.delete(`/students/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
