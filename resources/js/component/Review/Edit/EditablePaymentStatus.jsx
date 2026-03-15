import { useState, useEffect, useContext } from "react";
import { Edit3, Save, X, CreditCard } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";

export default function EditablePaymentStatus({ student, updateStudentField }) {
  const { token } = useContext(AppContext);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tempPayment, setTempPayment] = useState({
    tuition_payment: student?.tuition_payment || "not_paid",
    registration_months: student?.registration_months || [],
  });
console.log("EditablePaymentStatus student:", student);
  useEffect(() => {
    setTempPayment({
      tuition_payment: student?.tuition_payment || "not_paid",
      registration_months: student?.registration_months || [],
    });
  }, [student]);

  const registrationFee = 25000;
  const monthlyTuition = 50000;
  const currentYear = new Date().getFullYear();

  const months = [
    { id: 1, name: "Janvier" }, { id: 2, name: "Février" },
    { id: 3, name: "Mars" }, { id: 4, name: "Avril" },
    { id: 5, name: "Mai" }, { id: 6, name: "Juin" },
    { id: 7, name: "Juillet" }, { id: 8, name: "Août" },
    { id: 9, name: "Septembre" }, { id: 10, name: "Octobre" },
    { id: 11, name: "Novembre" }, { id: 12, name: "Décembre" }
  ];

  const toggleMonth = (monthId) => {
    setTempPayment(prev => ({
      ...prev,
      registration_months: prev.registration_months.includes(monthId)
        ? prev.registration_months.filter(m => m !== monthId)
        : [...prev.registration_months, monthId]
    }));
  };

  const registrationAmount =
    tempPayment.tuition_payment === "full" ? registrationFee :
    tempPayment.tuition_payment === "half" ? registrationFee / 2 : 0;

  const tuitionAmount =
    tempPayment.registration_months.length * monthlyTuition;

  const totalAmount = registrationAmount + tuitionAmount;

  const handleSave = async () => {
    if (!student?.id) return;

    setLoading(true);

    try {
      await updateStudentApi(
        student.id,
        {
          payment: {
            tuitionPayment: tempPayment.tuition_payment,
            registrationMonths: tempPayment.registration_months,
          }
        },
        token
      );

      // Mise à jour locale propre
      updateStudentField("tuition_payment", tempPayment.tuition_payment);
      updateStudentField("registration_months", tempPayment.registration_months);

      setEditing(false);

    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">

  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-2 text-gray-700">
      <CreditCard className="w-5 h-5 text-green-600" />
      <h3 className="font-semibold text-lg">Paiement</h3>
    </div>

    <div className="flex gap-2">
      {editing && (
        <button onClick={() => setEditing(false)}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      )}

      <button
        onClick={editing ? handleSave : () => setEditing(true)}
        disabled={loading}
        className="text-red-600 font-bold"
      >
        {editing ? <Save size={18}/> : <Edit3 size={18}/>}
      </button>
    </div>
  </div>

  {editing ? (
    <div className="space-y-6">
      {/* Statut inscription */}
      <div>
        <p className="font-medium mb-2">Droit d'inscription</p>
        <div className="flex gap-2">
          {["not_paid", "half", "full"].map(status => (
            <button
              key={status}
              onClick={() =>
                setTempPayment(prev => ({ ...prev, tuition_payment: status }))
              }
              className={`px-3 py-1 rounded-lg border text-sm ${
                tempPayment.tuition_payment === status
                  ? status === "half"
                    ? "bg-yellow-50 border-yellow-500 text-yellow-700"
                    : "bg-red-50 border-red-500 text-red-700"
                  : "border-gray-300"
              }`}
            >
              {status === "not_paid"
                ? "Non payé"
                : status === "half"
                ? "Moitié payé"
                : "Tout payé"}
            </button>
          ))}
        </div>
      </div>

      {/* Mois payés */}
      <div>
        <p className="font-medium mb-2">Mois payés ({currentYear})</p>
        <div className="flex flex-wrap gap-2">
          {months.map(month => (
            <button
              key={month.id}
              onClick={() => toggleMonth(month.id)}
              className={`px-3 py-1 border rounded-lg text-sm ${
                tempPayment.registration_months.includes(month.id)
                  ? "bg-red-50 border-red-500 text-red-700"
                  : "border-gray-300"
              }`}
            >
              {month.name}
            </button>
          ))}
        </div>
      </div>

      {/* Résumé */}
      <div className="bg-red-50 p-3 rounded-lg border">
        <div className="flex justify-between text-sm">
          <span>Inscription :</span>
          <span>{registrationAmount.toLocaleString()} MGA</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Écolage :</span>
          <span>{tuitionAmount.toLocaleString()} MGA</span>
        </div>
        <hr className="my-2"/>
        <div className="flex justify-between font-bold">
          <span>Total :</span>
          <span>{totalAmount.toLocaleString()} MGA</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="space-y-4">

      {/* Statut */}
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-700">Statut d'inscription</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            student.tuition_payment === "full"
              ? "bg-green-100 text-green-700"
              : student.tuition_payment === "half"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {student.tuition_payment === "full"
            ? "Tout payé"
            : student.tuition_payment === "half"
            ? "Moitié payé"
            : "Non payé"}
        </span>
      </div>

      {/* Mois */}
      <div>
        <p className="font-medium text-gray-700 mb-2">Mois payés</p>
        {student.registration_months?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {student.registration_months.map(monthId => {
              const monthName = months.find(m => m.id === monthId)?.name;
              return (
                <span
                  key={monthId}
                  className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-lg border border-green-200"
                >
                  {monthName}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aucun mois payé</p>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center border-t pt-3 mt-3">
        <span className="font-semibold text-gray-800">Total payé</span>
        <span className="font-bold text-lg text-red-700">{totalAmount.toLocaleString()} MGA</span>
      </div>

    </div>
  )}
</div>);
}
