// resources/js/component/Create/TuitionPayment.jsx

import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { getSettingsApi } from "../../api/academicYearApi";

export default function TuitionPayment({
  student,
  setStudent,
  errors,
}) {
  const { token } = useContext(AppContext);

  const [tempValue, setTempValue] = useState({
    registration_status:
      student.registration_status || "not_paid",
    paid_months: student.paid_months || [],
  });

  // ================= PARAMÈTRES =================

  const [settings, setSettings] = useState({
    registration_fee: 0,
    monthly_fee: 0,
  });

  const [loadingSettings, setLoadingSettings] = useState(true);

  const currentYear = new Date().getFullYear();

  // ================= MOIS =================

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
    { id: 12, name: "Décembre" },
  ];

  // ================= CHARGER SETTINGS =================

  useEffect(() => {
    const loadSettings = async () => {
      if (!token) return;

      try {
        setLoadingSettings(true);

        const data = await getSettingsApi(token);

        if (data) {
          setSettings({
            registration_fee:
              Number(data.registration_fee) || 0,

            monthly_fee:
              Number(data.monthly_fee) || 0,
          });
        }
      } catch (error) {
        console.error(
          "Erreur récupération paramètres :",
          error
        );
      } finally {
        setLoadingSettings(false);
      }
    };

    loadSettings();
  }, [token]);

  // ================= SYNCHRONISATION =================

  useEffect(() => {
    setTempValue({
      registration_status:
        student.registration_status || "not_paid",

      paid_months:
        student.paid_months || [],
    });
  }, [
    student.registration_status,
    student.paid_months,
  ]);

  // ================= INITIALISATION =================

  useEffect(() => {
    if (!student.registration_status) {
      setStudent((prev) => ({
        ...prev,
        registration_status: "not_paid",
        paid_months: [],
      }));
    }
  }, []);

  // ================= CALCUL MONTANTS =================

  const registrationFee = settings.registration_fee;
  const monthlyTuition = settings.monthly_fee;

  const registrationAmount =
    tempValue.registration_status === "full"
      ? registrationFee
      : tempValue.registration_status === "half"
      ? registrationFee / 2
      : 0;

  const tuitionAmount =
    tempValue.paid_months.length * monthlyTuition;

  const totalAmount =
    registrationAmount + tuitionAmount;

  // ================= STATUT INSCRIPTION =================

  const handleRegistrationStatusChange = (status) => {
    const updated = {
      ...tempValue,
      registration_status: status,
    };

    setTempValue(updated);

    setStudent((prev) => ({
      ...prev,
      registration_status:
        updated.registration_status,

      paid_months:
        updated.paid_months,
    }));
  };

  // ================= MOIS =================

  const handleMonthToggle = (monthId) => {
    const exists =
      tempValue.paid_months.includes(monthId);

    let updatedMonths;

    if (exists) {
      updatedMonths =
        tempValue.paid_months.filter(
          (id) => id !== monthId
        );
    } else {
      updatedMonths = [
        ...tempValue.paid_months,
        monthId,
      ].sort((a, b) => a - b);
    }

    const updated = {
      ...tempValue,
      paid_months: updatedMonths,
    };

    setTempValue(updated);

    setStudent((prev) => ({
      ...prev,
      registration_status:
        updated.registration_status,

      paid_months:
        updated.paid_months,
    }));
  };

  // ================= FORMAT MGA =================

  const formatMGA = (amount) => {
    return Number(amount || 0).toLocaleString(
      "fr-FR"
    );
  };

  // ================= LOADING =================

  if (loadingSettings) {
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-center py-6 text-gray-500">
          Chargement des paramètres financiers...
        </div>
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-4">

      <h2 className="text-2xl font-bold text-red-800 mb-2">
        Paiement des frais
      </h2>

      {/* ================= TARIFS CONFIGURÉS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500">
            Frais d'inscription
          </p>

          <p className="text-lg font-bold text-gray-800">
            {formatMGA(registrationFee)} MGA
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500">
            Écolage mensuel
          </p>

          <p className="text-lg font-bold text-gray-800">
            {formatMGA(monthlyTuition)} MGA
          </p>
        </div>

      </div>

      {/* ================= STATUT INSCRIPTION ================= */}

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Droit d'inscription
        </p>

        <div className="flex gap-2 flex-wrap">

          {["not_paid", "half", "full"].map(
            (status) => {
              const isActive =
                tempValue.registration_status ===
                status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    handleRegistrationStatusChange(
                      status
                    )
                  }
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
            }
          )}

        </div>

        {errors?.registration_status && (
          <p className="text-red-500 text-sm mt-1">
            {errors.registration_status[0]}
          </p>
        )}
      </div>

      {/* ================= MOIS PAYÉS ================= */}

      <div>

        <p className="text-sm font-medium text-gray-700 mb-2">
          Mois d'écolage payés ({currentYear})
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">

          {months.map((month) => {

            const isPaid =
              tempValue.paid_months.includes(
                month.id
              );

            return (
              <button
                key={month.id}
                type="button"
                onClick={() =>
                  handleMonthToggle(month.id)
                }
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

      {/* ================= RÉSUMÉ ================= */}

      <div className="bg-red-50 p-3 rounded-lg border border-red-200 shadow-sm">

        <div className="flex justify-between text-sm text-red-700">
          <span>
            Droit d'inscription :
          </span>

          <span>
            {formatMGA(registrationAmount)} MGA
          </span>
        </div>

        <div className="flex justify-between text-sm text-red-700">
          <span>
            Écolage ({tempValue.paid_months.length} mois) :
          </span>

          <span>
            {formatMGA(tuitionAmount)} MGA
          </span>
        </div>

        <hr className="border-red-200 my-2" />

        <div className="flex justify-between text-base font-bold text-red-800">
          <span>Total :</span>

          <span>
            {formatMGA(totalAmount)} MGA
          </span>
        </div>

      </div>

    </div>
  );
}
