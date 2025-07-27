import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';
import Sidebar from '../component/Sidebar';

export default function Layout() {
    const { user, token, setUser, setToken } = useContext(AppContext);
    const navigate = useNavigate();

    async function handleLogout(e) {
        e.preventDefault();
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            // Redirection vers la page de connexion après déconnexion
            navigate('/');
            setUser(null);
            setToken(null);
            localStorage.removeItem('token'); // Supprimer le token du stockage loca
        } else {
            // Gérer les erreurs de déconnexion si nécessaire
            console.error('Logout failed:', data);
            alert('Échec de la déconnexion. Veuillez réessayer.');

        }

    };

    return (
        <div className="min-h-screen flex flex-col bg-red-50">
            {/* Header avec fond rouge intense */}
            <header className="bg-gradient-to-r from-red-700 to-red-900 shadow-xl">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Lien Accueil à gauche */}
                        <Link
                            to="/"
                            className="text-red-100 hover:bg-red-800 hover:text-white px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 transform hover:scale-105"
                        >
                            Accueil
                        </Link>

                        {/* Liens dynamiques en fonction de l'état de connexion */}
                        <div className="flex space-x-1 md:space-x-4">

                            {user && user.firstName ? (
                                // Utilisateur connecté
                                <>
                                    <span className="text-red-100 px-4 py-3 rounded-lg text-sm font-bold">
                                        Bienvenue, {user.firstName}
                                    </span>
                                    <form onSubmit={handleLogout}>
                                        <button

                                            className="text-red-100 hover:bg-red-800 hover:text-white px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 transform hover:scale-105 cursor-pointer"
                                        >
                                            Logout
                                        </button>
                                    </form>
                                </>
                            ) : (
                                // Utilisateur non connecté
                                <Link
                                    to="/login"
                                    className="text-red-100 hover:bg-red-800 hover:text-white px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 transform hover:scale-105"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            {/* Contenu principal avec bordure rouge subtile */}
            <main className="flex-grow container mx-auto p-4 md:p-8 border-t-4 border-red-200">
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">

                            {user && user.firstName ? (
                                <Sidebar />
                            ) : (
                                <></>
                            )}
                    <Outlet />
                </div>
            </main>

            {/* Pied de page rouge foncé */}
            <footer className="bg-red-900 py-6 mt-12">
                <div className="text-center text-red-100 text-sm flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-8">
                    <span>© {new Date().getFullYear()} Purojekuto</span>
                </div>
            </footer>
        </div>
    );
}
