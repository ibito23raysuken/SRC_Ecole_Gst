import api from "./api";

/**
 * 📋 GET ALL
 */
export const getStudentsApi = async () => {
  const res = await api.get("/students");
  return res.data.data || res.data;
};

/**
 * 🔄 ALIAS (évite les erreurs anciennes)
 */
export const getAllStudentsApi = getStudentsApi;

/**
 * 🔍 GET ONE
 */
export const getStudentApi = async (id) => {
  const res = await api.get(`/students/${id}`);
  return res.data.data || res.data;
};

/**
 * ➕ CREATE
 */
export const createStudentApi = async (formData) => {
  try {
    const res = await api.post("/students", formData);
    return res.data;
  } catch (error) {
    if (error.response?.status === 422) {
      throw error.response.data;
    }
    throw error;
  }
};

/**
 * ✏️ UPDATE
 */
export const updateStudentApi = async (id, data) => {
  const formData = new FormData();
  formData.append("_method", "PATCH");

  Object.keys(data).forEach((key) => {
    if (data[key] instanceof File) {
      formData.append(key, data[key]);
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      formData.append(key, JSON.stringify(data[key]));
    } else if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      formData.append(key, data[key]);
    }
  });

  try {
    const res = await api.post(`/students/${id}`, formData);

    // ✅ Handle success - return the student data
    if (res.status === 200 && res.data.data) {
      return res.data.data;
    }
    return res.data;
  } catch (error) {
    // ✅ Handle validation errors and re-throw
    if (error.response?.status === 422) {
      throw error.response.data;
    }
    throw error;
  }
};

/**
 * ❌ DELETE
 */
export const deleteStudentApi = (id) => {
  return api.delete(`/students/${id}`);
};
