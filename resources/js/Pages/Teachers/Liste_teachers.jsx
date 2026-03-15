import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { getAllTeachersApi } from "../../api/apiTeachers";

export default function TeacherList() {
  const { token } = useContext(AppContext);

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const teachersPerPage = 8;

  // 🔥 Récupérer enseignants
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getAllTeachersApi(token);
        setTeachers(data);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [token]);

  // 🔎 Recherche
  const filteredTeachers = teachers.filter((teacher) => {
    if (!teacher) return false;

    const searchLower = searchTerm.toLowerCase();
    const fullName =
      `${teacher.first_name || ""} ${teacher.last_name || ""}`.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      (teacher.subject &&
        teacher.subject.toLowerCase().includes(searchLower))
    );
  });

  // 📄 Pagination
  const indexOfLast = currentPage * teachersPerPage;
  const indexOfFirst = indexOfLast - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  // 🗑 Suppression
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet enseignant ?"))
      return;

    try {
      const response = await fetch(`/api/teachers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 403) {
        alert("Vous n'avez pas la permission.");
        return;
      }

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setTeachers((prev) => prev.filter((t) => t.id !== id));
      alert("Enseignant supprimé avec succès !");
    } catch (err) {
      console.error(err);
      alert(`Impossible de supprimer : ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-red-800 mb-4 md:mb-0">
            Liste des Enseignants
          </h1>

          <Link
            to="/teachers/create"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow transition duration-200"
          >
            + Ajouter un enseignant
          </Link>
        </div>

        {/* Recherche */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un enseignant..."
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

        {/* Tableau */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <table className="min-w-full divide-y divide-red-100">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">
                      Prénom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">
                      Matière
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">
                      Salaire
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-red-100">
                  {currentTeachers.length > 0 ? (
                    currentTeachers.map((teacher) => (
                      <tr
                        key={teacher.id}
                        className="hover:bg-red-50 transition duration-150"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {teacher.last_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {teacher.first_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            {teacher.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {teacher.salary} MGA
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <Link
                            to={`/teachers/${teacher.id}`}
                            className="text-red-600 hover:text-red-900 mr-4"
                          >
                            Voir
                          </Link>

                          <button
                            onClick={() => handleDelete(teacher.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Effacer
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        Aucun enseignant trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredTeachers.length > teachersPerPage && (
              <div className="flex justify-between items-center">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
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
