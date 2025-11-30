import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../Context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function SchoolDashboard() {
  const { token } = useContext(AppContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Couleurs pour les graphiques
  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#8B5CF6', '#10B981'];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/students', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchStudents();
  }, [token]);

  // Statistiques
  const totalStudents = students.length;
  const averageAttendance = students.length
    ? Math.round(students.reduce((sum, s) => sum + (s.attendance || 0), 0) / students.length)
    : 0;

  const levelDistribution = students.reduce((acc, s) => {
    acc[s.grade_level] = (acc[s.grade_level] || 0) + 1;
    return acc;
  }, {});

  const genderDistribution = students.reduce((acc, s) => {
    acc[s.gender] = (acc[s.gender] || 0) + 1;
    return acc;
  }, {});

  const documentCompletion = students.length
    ? Math.round(
        students.reduce((sum, s) => {
          const completed = Object.values(s.dossier || {}).filter(Boolean).length;
          return sum + (completed / Object.values(s.dossier || {}).length) * 100;
        }, 0) / students.length
      )
    : 0;

  if (loading) return <p className="text-center mt-10">Chargement des données...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Erreur: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Tableau de bord de l'école</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total d'étudiants" value={totalStudents} />
        <StatCard label="Assiduité moyenne" value={`${averageAttendance}%`} />
        <StatCard label="Progression moyenne des dossiers" value={`${documentCompletion}%`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Répartition par niveau */}
        <Card title="Répartition par niveau">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(levelDistribution).map(([level, count]) => ({ level, count }))}>
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Répartition par genre */}
        <Card title="Répartition par genre">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(genderDistribution).map(([gender, count]) => ({ name: gender, value: count }))}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#36A2EB"
                label
              >
                {Object.entries(genderDistribution).map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Liste des étudiants avec moyenne et présence */}
      <Card title="Liste des étudiants">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-red-50 text-red-700">
              <tr>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Classe</th>
                <th className="p-3 text-left">Assiduité</th>
                <th className="p-3 text-left">Progression dossier</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const dossierProgress = Object.values(s.dossier || {}).filter(Boolean).length / Object.values(s.dossier || {}).length * 100 || 0;
                return (
                  <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{s.first_name} {s.last_name}</td>
                    <td className="p-3">{s.grade_level}</td>
                    <td className="p-3">{s.attendance || 0}%</td>
                    <td className="p-3">{Math.round(dossierProgress)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// Card générique
function Card({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-red-200">
      <h3 className="font-bold text-red-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}

// Carte statistique rapide
function StatCard({ label, value }) {
  return (
    <div className="bg-red-50 p-4 rounded-lg shadow border border-red-200 flex flex-col items-center">
      <p className="text-sm text-red-700">{label}</p>
      <p className="text-2xl font-bold text-red-700">{value}</p>
    </div>
  );
}
