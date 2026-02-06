import { useState, useEffect, useContext } from "react";
import { Edit3, Save, X } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";
import { School, CreditCard } from "lucide-react";
export default function EditablePaymentStatus({ student, value, updateStudentField }) {
  const { token } = useContext(AppContext);
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState({
    registration_status: value?.registration_status || "not_paid",
    paid_months: value?.paid_months || [],
  });
  const [loading, setLoading] = useState(false);

  const registrationFee = 25000;
  const monthlyTuition = 50000;
  const currentYear = new Date().getFullYear();

  const months = [
    { id: 1, name: "Janvier" }, { id: 2, name: "Février" }, { id: 3, name: "Mars" },
    { id: 4, name: "Avril" }, { id: 5, name: "Mai" }, { id: 6, name: "Juin" },
    { id: 7, name: "Juillet" }, { id: 8, name: "Août" }, { id: 9, name: "Septembre" },
    { id: 10, name: "Octobre" }, { id: 11, name: "Novembre" }, { id: 12, name: "Décembre" }
  ];

  useEffect(() => {
    setTempValue({
      registration_status: value?.registration_status || "not_paid",
      paid_months: value?.paid_months || [],
    });
  }, [value]);

  const registrationAmount =
    tempValue.registration_status === "full" ? registrationFee :
    tempValue.registration_status === "half" ? Math.floor(registrationFee / 2) : 0;

  const tuitionAmount = tempValue.paid_months.length * monthlyTuition;
  const totalAmount = registrationAmount + tuitionAmount;

  const handleRegistrationStatusChange = (status) => {
    setTempValue(prev => ({ ...prev, registration_status: status }));
  };

  const handleMonthToggle = (monthId) => {
    setTempValue(prev => {
      const updatedMonths = prev.paid_months.includes(monthId)
        ? prev.paid_months.filter(id => id !== monthId)
        : [...prev.paid_months, monthId];
      return {
        ...prev,
        paid_months: updatedMonths
      };
    });
  };

  const handleSave = async () => {
    if (!student?.id) return;
    setLoading(true);
    try {
      // Appel API pour sauvegarder la valeur
      await updateStudentApi(student.id, { paymentStatus: tempValue }, token);

      // Mise à jour du parent
      updateStudentField("paymentStatus", tempValue);

      setEditing(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du paiement :", err);
      alert("Impossible de sauvegarder le statut de paiement !");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempValue({
      registration_status: value?.registration_status || "not_paid",
      paid_months: value?.paid_months || [],
    });
    setEditing(false);
  };

  return (
    <div >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-6 text-gray-700">
            <CreditCard className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-lg">
                Paiement
            </h3>
        </div>
        <div className="flex items-center gap-2">
          {editing && (
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={editing ? handleSave : () => setEditing(true)}
            disabled={loading}
            className={`font-bold ${editing ? "text-green-600" : "text-red-600"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {editing ? <Save className="w-5 h-5 mr-1 inline" /> : <Edit3 className="w-5 h-5 mr-1 inline" />}
            {editing ? (loading ? "Sauvegarde..." : "") : ""}
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-4">
          {/* Statut inscription */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Droit d'inscription</p>
            <div className="flex gap-2">
              {["not_paid", "half", "full"].map(status => {
                const isActive = tempValue.registration_status === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleRegistrationStatusChange(status)}
                    className={`p-2 border rounded-lg text-sm transition-colors duration-200 ${
                      isActive
                        ? "border-red-500 bg-red-50 text-red-700 font-semibold"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {status === "not_paid" ? "Non payé" : status === "half" ? "Moitié payé" : "Tout payé"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mois payés */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Mois d'écolage payés ({currentYear})</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {months.map(month => (
                <button
                  key={month.id}
                  type="button"
                  onClick={() => handleMonthToggle(month.id)}
                  className={`p-2 border rounded-lg text-sm transition-colors duration-200 ${
                    tempValue.paid_months.includes(month.id)
                      ? "border-red-500 bg-red-50 text-red-700 font-semibold"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {month.name}
                </button>
              ))}
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-red-50 p-3 rounded-lg border border-red-200 shadow-sm">
            <div className="flex justify-between text-sm text-red-700">
              <span>Droit d'inscription :</span>
              <span>{registrationAmount.toLocaleString()} MGA</span>
            </div>
            <div className="flex justify-between text-sm text-red-700">
              <span>Écolage ({tempValue.paid_months.length} mois) :</span>
              <span>{tuitionAmount.toLocaleString()} MGA</span>
            </div>
            <hr className="border-red-200 my-2"/>
            <div className="flex justify-between text-base font-bold text-red-800">
              <span>Total :</span>
              <span>{totalAmount.toLocaleString()} MGA</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-gray-700 text-sm">
            Statut inscription : {tempValue.registration_status === "not_paid" ? "Non payé" : tempValue.registration_status === "half" ? "Moitié payé" : "Tout payé"}
          </p>
          <p className="text-gray-700 text-sm">
            Mois payés : {tempValue.paid_months.length > 0 ? tempValue.paid_months.map(id => months.find(m => m.id === id)?.name).join(", ") : "Aucun"}
          </p>
          <p className="text-gray-700 text-sm font-semibold">
            Total : {totalAmount.toLocaleString()} MGA
          </p>
        </div>
      )}
    </div>
  );
}
