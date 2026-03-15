import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { getTeacherApi } from "../../api/apiTeachers";
import { toast } from "react-hot-toast";

export default function TeacherDetail() {
  const { id } = useParams();
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Récupérer enseignant
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const data = await getTeacherApi(id, token);
        setTeacher(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer les informations de l'enseignant");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id, token]);

  // 🗑 Suppression
  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet enseignant ?")) return;

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

      toast.success("Enseignant supprimé avec succès !");
      navigate("/teachers");
    } catch (err) {
      console.error(err);
      toast.error(`Impossible de supprimer : ${err.message}`);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        <p>{error}</p>
      </div>
    );

  if (!teacher)
    return (
      <div className="text-center text-gray-500">Aucune information disponible</div>
    );

  return (
    <div className="min-h-screen bg-red-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
          {/* Photo */}
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-red-200">
            {teacher.photo ? (
              <img
                src={teacher.photo}
                alt={`${teacher.first_name} ${teacher.last_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-red-400 text-3xl font-bold">
                {teacher.first_name?.[0]}{teacher.last_name?.[0]}
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-red-800 mb-2">
              {teacher.first_name} {teacher.last_name}
            </h1>
            <p className="text-gray-700 mb-1"><strong>Email :</strong> {teacher.email}</p>
            <p className="text-gray-700 mb-1"><strong>Téléphone :</strong> {teacher.phone || "Non renseigné"}</p>
            <p className="text-gray-700 mb-1"><strong>Salaire :</strong> {teacher.salary} MGA</p>
            <p className="text-gray-700 mb-1"><strong>Date de naissance :</strong> {teacher.birth_date || "Non renseignée"}</p>
          </div>
        </div>

        {/* Matières enseignées */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Matières enseignées</h2>
          {teacher.subjects && teacher.subjects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {teacher.subjects.map((subj) => (
                <span
                  key={subj.id}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {subj.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune matière assignée</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate(`/teachers/${id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Modifier
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Supprimer
          </button>
          <button
            onClick={() => navigate("/teachers")}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
          >
            Retour
          </button>
        </div>

      </div>
    </div>
  );
}
