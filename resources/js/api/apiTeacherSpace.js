import api from './api';

export const getTeacherDashboardApi = () => api.get('/teacher/dashboard').then((response) => response.data);
export const getTeacherClassesApi = () => api.get('/teacher/classes').then((response) => response.data);
export const getTeacherStudentsApi = (params = {}) => api.get('/teacher/students', { params }).then((response) => response.data);
export const getTeacherStudentApi = (id) => api.get(`/teacher/students/${id}`).then((response) => response.data);
export const getTeacherNotesApi = (params) => api.get('/teacher/notes', { params }).then((response) => response.data);
export const saveTeacherNoteApi = (data) => api.post('/teacher/notes', data).then((response) => response.data);
export const getTeacherMessagesApi = () => api.get('/teacher/messages').then((response) => response.data);
export const getTeacherMessageRecipientsApi = () => api.get('/teacher/message-recipients').then((response) => response.data);
export const sendTeacherMessageApi = (data) => api.post('/teacher/messages', data).then((response) => response.data);
export const getTeacherConversationApi = (id) => api.get(`/teacher/messages/${id}`).then((response) => response.data);
export const replyTeacherMessageApi = (id, data) => api.post(`/teacher/messages/${id}/reply`, data).then((response) => response.data);
export const getAdminMessagesApi = () => api.get('/admin/messages').then((response) => response.data);
export const getAdminConversationApi = (id) => api.get(`/admin/messages/${id}`).then((response) => response.data);
export const replyAdminMessageApi = (id, data) => api.post(`/admin/messages/${id}/reply`, data).then((response) => response.data);
export const getTeacherProfileApi = () => api.get('/teacher/profile').then((response) => response.data);
export const updateTeacherProfileApi = (data) => api.patch('/teacher/profile', data).then((response) => response.data);
