// resources/js/component/Create/TuitionPayment.jsx
import React, { useState, useEffect } from "react";

export default function TuitionPayment({ student, onPaymentChange }) {
  const [paymentData, setPaymentData] = useState({
    registration_status: "not_paid", // 'not_paid', 'half_paid', 'fully_paid'
    tuition_status: "not_paid", // 'not_paid', 'half_paid', 'fully_paid'
    payment_method: "cash",
    paid_months: []
  });

  const registrationFee = 25000; // 25,000 FCFA - droit fixe d'inscription
  const monthlyTuition = 50000; // 50,000 FCFA par mois - écolage
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

  // Calculs des montants
  const registrationAmount =
    paymentData.registration_status === "fully_paid" ? registrationFee :
    paymentData.registration_status === "half_paid" ? Math.floor(registrationFee / 2) : 0;

  const tuitionAmount = paymentData.paid_months.length * monthlyTuition;
  const totalAmount = registrationAmount + tuitionAmount;

  // Notifier le parent des changements
  useEffect(() => {
    if (onPaymentChange) {
      onPaymentChange({
        ...paymentData,
        registration_fee: registrationFee,
        monthly_tuition: monthlyTuition,
        registration_amount: registrationAmount,
        tuition_amount: tuitionAmount,
        total_amount: totalAmount
      });
    }
  }, [paymentData, registrationAmount, tuitionAmount, totalAmount]);

  const handleRegistrationStatusChange = (status) => {
    setPaymentData(prev => ({
      ...prev,
      registration_status: status
    }));
  };

  const handleTuitionStatusChange = (status) => {
    let updatedMonths = [];

    if (status === "fully_paid") {
      updatedMonths = months.map(month => month.id);
    } else if (status === "half_paid") {
      // Sélectionne les 6 premiers mois par défaut
      updatedMonths = months.slice(0, 6).map(month => month.id);
    }
    // Pour "not_paid", updatedMonths reste vide

    setPaymentData(prev => ({
      ...prev,
      tuition_status: status,
      paid_months: updatedMonths
    }));
  };

  const handleMonthToggle = (monthId) => {
    setPaymentData(prev => {
      const updatedMonths = prev.paid_months.includes(monthId)
        ? prev.paid_months.filter(id => id !== monthId)
        : [...prev.paid_months, monthId];

      // Déterminer le statut de l'écolage basé sur le nombre de mois sélectionnés
      let newTuitionStatus = prev.tuition_status;
      if (updatedMonths.length === 0) {
        newTuitionStatus = "not_paid";
      } else if (updatedMonths.length === months.length) {
        newTuitionStatus = "fully_paid";
      } else {
        newTuitionStatus = "half_paid";
      }

      return {
        ...prev,
        tuition_status: newTuitionStatus,
        paid_months: updatedMonths
      };
    });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentData(prev => ({
      ...prev,
      payment_method: method
    }));
  };

  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6 pb-2 border-b border-gray-200">
        Paiement des frais de scolarité
      </h2>

      {/* Paiement de l'inscription (droit fixe) */}
      <div className="mb-6 lg:mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Droit d'inscription
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleRegistrationStatusChange("not_paid")}
            className={`p-3 lg:p-4 border rounded-lg text-center transition-colors duration-200 ${
              paymentData.registration_status === "not_paid"
                ? "border-red-500 bg-red-50 text-red-700 font-semibold"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="text-lg font-bold">Non payé</div>
          </button>

          <button
            type="button"
            onClick={() => handleRegistrationStatusChange("half_paid")}
            className={`p-3 lg:p-4 border rounded-lg text-center transition-colors duration-200 ${
              paymentData.registration_status === "half_paid"
                ? "border-orange-500 bg-orange-50 text-orange-700 font-semibold"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="text-lg font-bold">Moitié payé</div>
          </button>

          <button
            type="button"
            onClick={() => handleRegistrationStatusChange("fully_paid")}
            className={`p-3 lg:p-4 border rounded-lg text-center transition-colors duration-200 ${
              paymentData.registration_status === "fully_paid"
                ? "border-green-500 bg-green-50 text-green-700 font-semibold"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="text-lg font-bold">Tout payé</div>
          </button>
        </div>
      </div>

      {/* Paiement de l'écolage (frais mensuels) */}
      <div className="mb-6 lg:mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Écolage - Frais mensuels
        </label>


        {/* Sélection des mois d'écolage payés */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mois d'écolage payés ({currentYear})
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-3">
            {months.map(month => (
              <button
                key={month.id}
                type="button"
                onClick={() => handleMonthToggle(month.id)}
                className={`p-2 lg:p-3 border rounded-lg text-center transition-colors duration-200 ${
                  paymentData.paid_months.includes(month.id)
                    ? "border-green-500 bg-green-50 text-green-700 font-semibold"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="text-sm font-medium">{month.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>



      {/* Récapitulatif */}
      <div className="bg-blue-50 p-4 lg:p-6 rounded-lg border border-blue-200">
        <h3 className="text-md lg:text-lg font-semibold text-blue-800 mb-3">
          Récapitulatif du paiement
        </h3>
        <div className="space-y-2 text-sm lg:text-base">
          {/* Droit d'inscription */}
          <div className="flex justify-between">
            <span className="text-gray-600">Droit d'inscription:</span>
            <span className={`font-medium ${
              paymentData.registration_status === "fully_paid" ? "text-green-600" :
              paymentData.registration_status === "half_paid" ? "text-orange-600" : "text-gray-600"
            }`}>
              {paymentData.registration_status === "fully_paid" ?
                `${registrationFee.toLocaleString()} MGA` :
              paymentData.registration_status === "half_paid" ?
                `${Math.floor(registrationFee / 2).toLocaleString()} MGA` : "Non payé"}
            </span>
          </div>

          {/* Écolage */}
          <div className="flex justify-between">
            <span className="text-gray-600">Mois d'écolage payés:</span>
            <span className="font-medium">
              {paymentData.paid_months.length} / 12 mois
            </span>
          </div>

          {/* Montants */}
          <div className="flex justify-between pt-2 border-t border-blue-200">
            <span className="text-gray-800 font-semibold">Montant total:</span>
            <span className="text-lg font-bold text-green-600">
              {totalAmount.toLocaleString()} MGA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
