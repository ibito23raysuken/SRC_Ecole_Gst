import api from './api';

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
