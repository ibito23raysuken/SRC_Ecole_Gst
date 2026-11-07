import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import api from '../../api/api';

export default function LoginWithFirstName() {
  const [loginData, setLoginData] = useState({ first_name: '', password: '' });
  const { setToken, setUser } = useContext(AppContext);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      const { data } = await api.post('/login', loginData);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      const user = { ...data.user, role: String(data.user?.role || '').trim().toLowerCase() };
      setUser(user);
      navigate(user.role === 'teacher' ? '/teacher' : '/');
    } catch (error) {
      setErrors(error.response?.data?.errors || { first_name: [error.response?.data?.message || 'Connexion impossible.'] });
    } finally {
      setIsSubmitting(false);
    }
  }

  return <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md"><h2 className="mb-6 text-center text-2xl font-bold text-red-700">Connexion utilisateur</h2><form onSubmit={handleSubmit} className="space-y-4"><div><label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Prénom</label><input type="text" id="first_name" name="first_name" value={loginData.first_name} onChange={(event) => setLoginData({ ...loginData, first_name: event.target.value })} className={`mt-1 block w-full rounded-md border p-2 shadow-sm ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`} autoComplete="username" />{errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name.join(' ')}</p>}</div><div><label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label><input type="password" id="password" name="password" value={loginData.password} onChange={(event) => setLoginData({ ...loginData, password: event.target.value })} className={`mt-1 block w-full rounded-md border p-2 shadow-sm ${errors.password ? 'border-red-500' : 'border-gray-300'}`} autoComplete="current-password" />{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.join(' ')}</p>}</div><button type="submit" disabled={isSubmitting} className={`flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${isSubmitting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}>{isSubmitting ? 'Connexion en cours…' : 'Se connecter'}</button></form></div>;
}
