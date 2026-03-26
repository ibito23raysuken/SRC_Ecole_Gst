import { useState, useEffect, useContext } from "react";
import { Edit3, Save, X } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";
import { toast } from "react-hot-toast";

export default function EditablePhone({ student, updateStudentField, label = "Téléphone" }) {
  const { token } = useContext(AppContext);

  const [editing, setEditing] = useState(false);
  const [countryCode, setCountryCode] = useState("+261");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 synchronisation avec parent
  useEffect(() => {
    setCountryCode(student.country_code || "+261");
    setPhone(student.phone || "");
  }, [student]);

  const handleSave = async () => {
    if (!student?.id) return;

    setLoading(true);

    try {
      const res = await updateStudentApi(
        student.id,
        { phone, country_code: countryCode },
        token
      );

      updateStudentField(res.student, `${label} mis à jour ✅`);
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(`Erreur lors de la mise à jour de ${label} ❌`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCountryCode(student.country_code || "+261");
    setPhone(student.phone || "");
    setEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">{label}</p>

        {editing ? (
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              disabled={loading}
              className="px-2 py-1 border rounded w-24 disabled:opacity-50"
            >
              <option value="+261">+261 (MG)</option>
              <option value="+33">+33 (FR)</option>
              <option value="+1">+1 (US)</option>
            </select>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              className="border rounded-md p-1 flex-1 disabled:opacity-50"
              placeholder="Numéro"
              autoFocus
            />
          </div>
        ) : (
          <p className="font-medium text-gray-800">
            {phone ? `${countryCode} ${phone}` : "Non renseigné"}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 ml-2">
        {editing && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={editing ? handleSave : () => setEditing(true)}
          disabled={loading}
          className={`font-bold ${editing ? "text-green-600" : "text-red-600"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {editing ? (
            <>
              <Save className="w-5 h-5" />
              {loading && " ..."}
            </>
          ) : (
            <Edit3 className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
