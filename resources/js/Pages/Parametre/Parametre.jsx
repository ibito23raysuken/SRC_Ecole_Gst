import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../Context/AppContext";

export default function SettingsPage() {
  const { token } = useContext(AppContext);

  const [settings, setSettings] = useState({
    schoolName: "",
    schoolEmail: "",
    schoolPhone: "",
    schoolAddress: "",
    academicYear: "",
  });

  const [loading, setLoading] = useState(true);

  // Génération dynamique années scolaires
  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = -2; i <= 3; i++) {
      const start = currentYear + i;
      const end = start + 1;
      years.push(`${start} - ${end}`);
    }

    return years;
  };

  // Charger paramètres
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        setSettings({
          schoolName: data.schoolName || "",
          schoolEmail: data.schoolEmail || "",
          schoolPhone: data.schoolPhone || "",
          schoolAddress: data.schoolAddress || "",
          academicYear: data.academicYear || "",
        });

      } catch (error) {
        console.error("Erreur chargement settings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchSettings();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert("Erreur lors de la sauvegarde");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Chargement...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-red-700">
        Paramètres de l'application
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <Card title="Informations de l'école">
          <Input label="Nom de l'école" name="schoolName" value={settings.schoolName} onChange={handleChange} />
          <Input label="Email" name="schoolEmail" value={settings.schoolEmail} onChange={handleChange} />
          <Input label="Téléphone" name="schoolPhone" value={settings.schoolPhone} onChange={handleChange} />
          <Input label="Adresse" name="schoolAddress" value={settings.schoolAddress} onChange={handleChange} />
        </Card>

        <Card title="Année scolaire">
          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Année en cours</label>
            <select
              name="academicYear"
              value={settings.academicYear}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">Sélectionner une année</option>
              {generateAcademicYears().map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </Card>

        <div className="text-right">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow"
          >
            Sauvegarder
          </button>
        </div>

      </form>
    </div>
  );
}

/* UI Components */

function Card({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border border-red-200 space-y-4">
      <h3 className="text-lg font-bold text-red-700">{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-700">{label}</label>
      <input
        {...props}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
      />
    </div>
  );
}
