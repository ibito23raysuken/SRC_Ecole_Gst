import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { Edit3, Save } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";

import { getSettingsApi, saveSettingsApi } from "../../api/academicYearApi";

export default function SettingsPage() {
  const { token } = useContext(AppContext);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    school_name: "",
    school_email: "",
    country_code: "+261",
    school_phone: "",
    school_address: "",
    academic_year: new Date(),
  });

  const [initialForm, setInitialForm] = useState(null);

  // ================= LOAD =================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSettingsApi(token);

        if (data) {
          const newForm = {
            school_name: data.school_name || "",
            school_email: data.school_email || "",
            country_code: data.country_code || "+261",
            school_phone: data.school_phone || "",
            school_address: data.school_address || "",
            academic_year: data.academic_year
              ? new Date(`${data.academic_year.split(" - ")[0]}-01-01`)
              : new Date(),
          };

          setForm({ ...newForm });
          setInitialForm({ ...newForm }); // 🔥 clone important
        }
      } catch (e) {
        toast.error("Erreur chargement ❌");
      } finally {
        setLoading(false);
      }
    };

    if (token) load();
  }, [token]);

  // ================= CHECK EMPTY =================
  const isEmpty =
    !form.school_name &&
    !form.school_email &&
    !form.school_phone &&
    !form.school_address;

  // ================= RESET =================
  const resetForm = () => {
    if (!initialForm) return;
    setForm(JSON.parse(JSON.stringify(initialForm))); // 🔥 clone profond
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (saving) return;

    if (!form.school_name) {
      toast.error("Nom école requis ❌");
      return;
    }

    setSaving(true);

    const body = {
      ...form,
      academic_year: `${form.academic_year.getFullYear()} - ${
        form.academic_year.getFullYear() + 1
      }`,
    };

    try {
      await toast.promise(saveSettingsApi(body, token), {
        loading: "Sauvegarde en cours...",
        success: "Paramètres enregistrés ✅",
        error: "Erreur lors de la sauvegarde ❌",
      });

      setEditing(false);
      setInitialForm({ ...form }); // 🔥 update propre
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isDirty =
    JSON.stringify(form) !== JSON.stringify(initialForm);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Chargement...
      </div>
    );
  }

  // ================= EMPTY UI =================
  if (isEmpty && !editing) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white border border-red-200 rounded-2xl shadow p-10 text-center space-y-4">

          <div className="text-5xl">⚙️</div>

          <h2 className="text-xl font-bold text-gray-800">
            Paramètres non configurés
          </h2>

          <p className="text-gray-500">
            Configurez les informations de votre école pour commencer.
          </p>

          <button
            onClick={() => setEditing(true)}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Configurer maintenant
          </button>

        </div>
      </div>
    );
  }

  // ================= NORMAL UI =================
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white border border-red-200 rounded-2xl shadow p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-red-700">
            Paramètres de l'école
          </h2>

          <div className="flex gap-2">

            {editing && (
              <button
                onClick={() => {
                  resetForm(); // 🔥 fonctionne maintenant
                  setEditing(false);
                }}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Annuler
              </button>
            )}

            <button
              onClick={() => (editing ? handleSave() : setEditing(true))}
              disabled={saving || (editing && !isDirty)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition disabled:opacity-50"
            >
              {editing ? (
                <>
                  <Save className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 text-sm">
                    {saving ? "..." : "Enregistrer"}
                  </span>
                </>
              ) : (
                <>
                  <Edit3 className="w-5 h-5 text-red-600" />
                  <span className="text-red-600 text-sm">
                    Modifier
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-4">

          <Field
            label="Nom école"
            value={form.school_name}
            editing={editing}
            onChange={(v) => handleChange("school_name", v)}
          />

          <Field
            label="Email"
            value={form.school_email}
            editing={editing}
            onChange={(v) => handleChange("school_email", v)}
          />

          {/* TELEPHONE */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Téléphone</p>

            {!editing ? (
              <div className="h-10 flex items-center px-3 rounded-lg bg-gray-50">
                {form.country_code} {form.school_phone || "-"}
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  value={form.country_code}
                  onChange={(e) =>
                    handleChange("country_code", e.target.value)
                  }
                  className="w-28 h-10 px-2 border rounded-lg focus:ring-2 focus:ring-red-400"
                >
                  <option value="+261">+261 (MG)</option>
                  <option value="+33">+33 (FR)</option>
                  <option value="+1">+1 (US)</option>
                </select>

                <input
                  value={form.school_phone}
                  onChange={(e) =>
                    handleChange("school_phone", e.target.value)
                  }
                  placeholder="XX-XX-XXX-XX"
                  className="flex-1 h-10 px-3 border rounded-lg focus:ring-2 focus:ring-red-400"
                />
              </div>
            )}
          </div>

          <Field
            label="Adresse"
            value={form.school_address}
            editing={editing}
            onChange={(v) => handleChange("school_address", v)}
          />

          {/* YEAR */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Année scolaire</p>

            {!editing ? (
              <div className="h-10 flex items-center px-3 rounded-lg bg-gray-50 text-red-700 font-medium">
                {form.academic_year.getFullYear()} -{" "}
                {form.academic_year.getFullYear() + 1}
              </div>
            ) : (
              <DatePicker
                selected={form.academic_year}
                onChange={(date) => {
                  if (date) handleChange("academic_year", date);
                }}
                showYearPicker
                dateFormat="yyyy"
                className="w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-red-400"
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= FIELD ================= */

function Field({ label, value, editing, onChange }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-500">{label}</p>

      {!editing ? (
        <div className="h-10 flex items-center px-3 rounded-lg bg-gray-50">
          {value || "-"}
        </div>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-red-400"
        />
      )}
    </div>
  );
}
