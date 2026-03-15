// resources/js/component/Create/TuitionPayment.jsx
import { useState, useEffect } from "react";

export default function TuitionPayment({ student, setStudent, errors }) {

  const [tempValue, setTempValue] = useState({
    registration_status: student.registration_status || "not_paid",
    paid_months: student.paid_months || [],
  });

  const registrationFee = 25000;
  const monthlyTuition = 50000;
  const currentYear = new Date().getFullYear();

  const months = [
    { id: 1, name: "Janvier" },
    { id: 2, name: "Février" },
    { id: 3, name: "Mars" },
    { id: 4, name: "Avril" },
    { id: 5, name: "Mai" },
    { id: 6, name: "Juin" },
    { id: 7, name: "Juillet" },
    { id: 8, name: "Août" },
    { id: 9, name: "Septembre" },
    { id: 10, name: "Octobre" },
    { id: 11, name: "Novembre" },
    { id: 12, name: "Décembre" }
  ];

  // Synchronisation avec le state parent
  useEffect(() => {
    setTempValue({
      registration_status: student.registration_status || "not_paid",
      paid_months: student.paid_months || [],
    });
  }, [student.registration_status, student.paid_months]);

  // Calcul des montants
  const registrationAmount =
    tempValue.registration_status === "full"
      ? registrationFee
      : tempValue.registration_status === "half"
      ? registrationFee / 2
      : 0;

  const tuitionAmount = tempValue.paid_months.length * monthlyTuition;
  const totalAmount = registrationAmount + tuitionAmount;

  // Changer le statut d'inscription
  const handleRegistrationStatusChange = (status) => {
    const updated = {
      ...tempValue,
      registration_status: status,
    };

    setTempValue(updated);

    setStudent(prev => ({
      ...prev,
      registration_status: updated.registration_status,
      paid_months: updated.paid_months,
    }));
  };

  // Cocher / décocher un mois
  const handleMonthToggle = (monthId) => {
    const exists = tempValue.paid_months.includes(monthId);

    let updatedMonths;

    if (exists) {
      updatedMonths = tempValue.paid_months.filter(id => id !== monthId);
    } else {
      updatedMonths = [...tempValue.paid_months, monthId].sort((a, b) => a - b);
    }

    const updated = {
      ...tempValue,
      paid_months: updatedMonths,
    };

    setTempValue(updated);

    setStudent(prev => ({
      ...prev,
      registration_status: updated.registration_status,
      paid_months: updated.paid_months,
    }));
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-800 mb-2">
        Paiement des frais
      </h2>

      {/* Statut inscription */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Droit d'inscription
        </p>

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
                {status === "not_paid"
                  ? "Non payé"
                  : status === "half"
                  ? "Moitié payé"
                  : "Tout payé"}
              </button>
            );
          })}
        </div>

        {errors?.registration_status && (
          <p className="text-red-500 text-sm mt-1">
            {errors.registration_status[0]}
          </p>
        )}
      </div>

      {/* Mois payés */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Mois d'écolage payés ({currentYear})
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {months.map(month => {
            const isPaid = tempValue.paid_months.includes(month.id);

            return (
              <button
                key={month.id}
                type="button"
                onClick={() => handleMonthToggle(month.id)}
                className={`p-2 border rounded-lg text-sm transition-colors duration-200 ${
                  isPaid
                    ? "border-red-500 bg-red-50 text-red-700 font-semibold"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {month.name}
              </button>
            );
          })}
        </div>

        {errors?.paid_months && (
          <p className="text-red-500 text-sm mt-1">
            {errors.paid_months[0]}
          </p>
        )}
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

        <hr className="border-red-200 my-2" />

        <div className="flex justify-between text-base font-bold text-red-800">
          <span>Total :</span>
          <span>{totalAmount.toLocaleString()} MGA</span>
        </div>
      </div>
    </div>
  );
}
