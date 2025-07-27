import { useState,useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
export default function LoginWithFirstName() {
  const [loginData, setLoginData] = useState({
    firstName: '',
    password: ''
  });
const{token,setToken}=useContext(AppContext);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
                  'Accept': 'application/json',
        },
        body: JSON.stringify({
          firstName: loginData.firstName,
          password: loginData.password
        })
      });
const data = await response.json();
       if (data.errors) {
      setErrors(data.errors);
    }else {

        localStorage.setItem('token', data.token);
        setToken(data.token);
        navigate('/');
        console.log(data);
    }
            setIsSubmitting(false);

  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-red-700 mb-6">Connexion Utilisateur</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champ Prénom */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
             Prénom
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={loginData.firstName}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
            placeholder="Entrez votre prénom"
            autoComplete="given-name"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>

        {/* Champ Mot de passe */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} focus:outline-none`}
        >
          {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
