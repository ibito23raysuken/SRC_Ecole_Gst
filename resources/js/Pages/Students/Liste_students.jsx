import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import { getAllStudentsApi } from '../../api/apistudents';
import { Trash2, Eye } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export default function StudentList() {
  const { token } = useContext(AppContext);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const studentsPerPage = 8;

  // 🔄 FETCH
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getAllStudentsApi(token);
        setStudents(data);
      } catch (err) {
        toast.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token]);

  // 🔍 FILTER
  const filteredStudents = students.filter((s) => {
    const search = searchTerm.toLowerCase();
    const fullName = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase();

    return (
      fullName.includes(search) ||
      (s.grade_level && s.grade_level.toLowerCase().includes(search))
    );
  });

  // 📄 PAGINATION
  const indexLast = currentPage * studentsPerPage;
  const currentStudents = filteredStudents.slice(indexLast - studentsPerPage, indexLast);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // ❌ DELETE
  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/students/${studentToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete));
      toast.success("Étudiant supprimé ✅");
    } catch (err) {
      toast.error("Erreur lors de la suppression ❌");
    } finally {
      setStudentToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 p-6">

      {/* 🔥 TOAST */}
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold text-red-800">
            Liste des Élèves
          </h1>

          <Link
            to="/students/create"
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            + Ajouter
          </Link>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Rechercher un élève..."
          className="w-full p-3 mb-6 border rounded-lg focus:ring-2 focus:ring-red-200"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-red-50">
              <tr>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Prénom</th>
                <th className="p-3 text-center">Classe</th>
                <th className="p-3 text-center">Année</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-6">
                    Chargement...
                  </td>
                </tr>
              ) : currentStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    Aucun élève trouvé
                  </td>
                </tr>
              ) : (
                currentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-red-50 transition">

                    <td className="p-3">{student.last_name}</td>
                    <td className="p-3">{student.first_name}</td>
                    <td className="p-3 text-center">{student.school_class?.name || "Non assigné"}</td>
                    <td className="p-3 text-center">{student.academic_year}</td>

                    <td className="p-3 flex justify-end gap-4">

                      {/* 👁️ VOIR */}
                      <Link
                        to={`/students/${student.id}`}
                        className="group flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition"
                      >
                        <Eye className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition" />

                        <span className="max-w-0 overflow-hidden opacity-0
                          group-hover:max-w-[80px] group-hover:opacity-100
                          transition-all duration-300 text-blue-600 text-sm whitespace-nowrap">
                          Voir
                        </span>
                      </Link>

                      {/* 🗑️ SUPPRIMER */}
                      <button
                        onClick={() => setStudentToDelete(student.id)}
                        className="group flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition" />

                        <span className="max-w-0 overflow-hidden opacity-0
                          group-hover:max-w-[100px] group-hover:opacity-100
                          transition-all duration-300 text-red-600 text-sm whitespace-nowrap">
                          Supprimer
                        </span>
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Précédent
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>

      {/* 🔥 MODAL */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">

            <h2 className="text-xl font-bold text-red-700 mb-2">
              Supprimer cet étudiant ?
            </h2>

            <p className="text-gray-600 mb-6">
              Cette action est irréversible.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Annuler
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Supprimer
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
