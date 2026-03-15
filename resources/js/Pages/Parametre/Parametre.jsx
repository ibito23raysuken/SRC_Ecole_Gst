import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const { token } = useContext(AppContext);

  const [settings, setSettings] = useState({
    school_name: "",
    school_email: "",
    school_phone: "",
    school_address: "",
    academic_year: new Date(),
  });

  const [loading, setLoading] = useState(true);

  // Charger les paramètres
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        setSettings({
          school_name: data.school_name || "",
          school_email: data.school_email || "",
          school_phone: data.school_phone || "",
          school_address: data.school_address || "",
          academic_year: data.academic_year
            ? new Date(data.academic_year.split(" - ")[0] + "-01-01")
            : new Date(),
        });

      } catch (err) {
        console.error(err);
        toast.error("Erreur chargement des paramètres ❌");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchSettings();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleYearChange = (date) => {
    setSettings((prev) => ({ ...prev, academic_year: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        school_name: settings.school_name,
        school_email: settings.school_email,
        school_phone: settings.school_phone,
        school_address: settings.school_address,
        academic_year: `${settings.academic_year.getFullYear()} - ${
          settings.academic_year.getFullYear() + 1
        }`,
      };

      const res = await fetch("http://localhost:8000/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      toast.success(data.message || "Paramètres sauvegardés avec succès ✅");

    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la sauvegarde ❌");
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      <h1 className="text-3xl font-bold text-red-700">
        Paramètres de l'application
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <Card title="Informations de l'école">

          <Input
            label="Nom de l'école"
            name="school_name"
            value={settings.school_name}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="school_email"
            value={settings.school_email}
            onChange={handleChange}
          />

          <Input
            label="Téléphone"
            name="school_phone"
            value={settings.school_phone}
            onChange={handleChange}
          />

          <Input
            label="Adresse"
            name="school_address"
            value={settings.school_address}
            onChange={handleChange}
          />

        </Card>

        <Card title="Année scolaire">

          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Année en cours</label>

            <DatePicker
              selected={settings.academic_year}
              onChange={handleYearChange}
              showYearPicker
              dateFormat="yyyy"
              className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-red-400"
            />

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
