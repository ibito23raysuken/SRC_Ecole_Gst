import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { getAllSchoolClassesApi, deleteSchoolClassApi } from "../../api/apiSchoolClasses";

export default function SchoolClassList() {
  const { token } = useContext(AppContext);

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const classesPerPage = 8;

  // 🔥 Charger les classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (!token) throw new Error("Token manquant !");
        const data = await getAllSchoolClassesApi(token);
        setClasses(data);
        setError(null);
      } catch (err) {
        console.error("Erreur de chargement :", err);
        setError(err.response?.data?.message || err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [token]);

  // 🔎 Filtrer les classes par recherche
  const filteredClasses = classes.filter((classe) => {
    if (!classe) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (classe.name || "").toLowerCase().includes(searchLower) ||
      (classe.grade_level || "").toLowerCase().includes(searchLower)
    );
  });

  // 📄 Pagination
  const indexOfLast = currentPage * classesPerPage;
  const indexOfFirst = indexOfLast - classesPerPage;
  const currentClasses = filteredClasses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);

  // 🗑 Supprimer une classe
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette classe ?")) return;

    try {
      await deleteSchoolClassApi(id, token);
      setClasses((prev) => prev.filter((c) => c.id !== id));
      alert("Classe supprimée avec succès !");
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer : " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-red-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-red-800 mb-4 md:mb-0">
            Liste des Classes
          </h1>
          <Link
            to="/SchoolClass/create"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow transition duration-200"
          >
            + Ajouter une classe
          </Link>
        </div>

        {/* Recherche */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une classe..."
              className="w-full p-3 pl-10 rounded-lg border border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-3 text-red-400">🔍</span>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Erreur</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* Tableau */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <table className="min-w-full divide-y divide-red-100">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Niveau</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-red-100">
                  {currentClasses.length > 0 ? (
                    currentClasses.map((classe) => (
                      <tr key={classe.id} className="hover:bg-red-50 transition duration-150">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{classe.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{classe.grade_level}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <Link
                            to={`/classes/${classe.id}`}
                            className="text-red-600 hover:text-red-900 mr-4"
                          >
                            Voir
                          </Link>
                          <button
                            onClick={() => handleDelete(classe.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Effacer
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                        Aucune classe trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredClasses.length > classesPerPage && (
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  }`}
                >
                  Précédent
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-md ${
                        currentPage === i + 1
                          ? "bg-red-600 text-white"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  }`}
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
