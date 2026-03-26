import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { Accept: "application/json" }
});

export async function saveScheduleApi(token, classId, schedules) {
  const response = await api.post(
    `/schedules`,
    {
      school_class_id: classId,
      schedules: schedules
    },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
}
export async function getScheduleApi(token, classId) {
  const response = await api.get(`/schedules/${classId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}
