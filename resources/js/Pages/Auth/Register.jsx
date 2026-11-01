import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import api from '../../api/api';

export default function RegistrationForm() {
  const navigate = useNavigate(); const { setToken } = useContext(AppContext); const [isSubmitting, setIsSubmitting] = useState(false); const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ firstName: '', lastName: '', password: '', password_confirmation: '' });
  async function handleSubmit(event) { event.preventDefault(); setIsSubmitting(true); setErrors({}); try { const { data } = await api.post('/register', formData); localStorage.setItem('token', data.token); setToken(data.token); navigate('/'); } catch (error) { setErrors(error.response?.data?.errors || { general: [error.response?.data?.message || 'Inscription impossible.'] }); } finally { setIsSubmitting(false); } }
  const field = (name, label, type = 'text') => <div><label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label><input type={type} id={name} name={name} value={formData[name]} onChange={(event) => setFormData({ ...formData, [name]: event.target.value })} className={`mt-1 block w-full rounded-md border p-2 shadow-sm ${errors[name] ? 'border-red-500' : 'border-gray-300'}`} />{errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name].join(' ')}</p>}</div>;
  return <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md"><h2 className="mb-6 text-center text-2xl font-bold text-red-700">Ajout d’utilisateur</h2><form onSubmit={handleSubmit} className="space-y-4">{field('firstName', 'Prénom')}{field('lastName', 'Nom')}{field('password', 'Mot de passe', 'password')}{field('password_confirmation', 'Confirmation du mot de passe', 'password')}{errors.general && <p className="text-sm text-red-600">{errors.general.join(' ')}</p>}<button type="submit" disabled={isSubmitting} className={`flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${isSubmitting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}>{isSubmitting ? 'Enregistrement…' : 'Enregistrer'}</button></form></div>;
}
