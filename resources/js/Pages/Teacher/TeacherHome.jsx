import { useContext } from 'react';
import { AppContext } from '../../Context/AppContext';

export default function TeacherHome() {
  const { user } = useContext(AppContext);

  return (
    <section className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
      <h1 className="text-3xl font-bold text-red-800">Espace enseignant</h1>
      <p className="mt-3 text-gray-700">
        Bienvenue {user?.first_name}. Votre espace personnel est protégé par votre rôle enseignant.
      </p>
    </section>
  );
}
