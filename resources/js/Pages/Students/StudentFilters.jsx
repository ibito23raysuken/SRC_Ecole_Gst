import { Filter, RotateCcw, Search, X } from "lucide-react";

const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const paymentLabels = { paid: "À jour", unpaid: "Non payé", partial: "Paiement partiel", overdue: "En retard" };

export default function StudentFilters({ filters, classes, academicYears, onChange, onApply, onReset, onRemove }) {
  const active = [
    filters.search && { key: "search", label: `Recherche : ${filters.search}` },
    filters.school_class_id && { key: "school_class_id", label: `Classe : ${classes.find((item) => String(item.id) === String(filters.school_class_id))?.name || "Sélectionnée"}` },
    filters.academic_year_id && { key: "academic_year_id", label: `Année : ${academicYears.find((item) => String(item.id) === String(filters.academic_year_id))?.name || "Sélectionnée"}` },
    filters.month && { key: "month", label: `Mois : ${months[Number(filters.month) - 1]}` },
    filters.payment_status && { key: "payment_status", label: `Paiement : ${paymentLabels[filters.payment_status] || filters.payment_status}` },
    filters.fee_type !== "all" && { key: "fee_type", label: `Frais : ${filters.fee_type === "monthly" ? "Écolage mensuel" : "Frais d'inscription"}` },
    filters.paid_state && { key: "paid_state", label: `Montant : ${filters.paid_state === "has_balance" ? "Solde restant" : filters.paid_state === "nothing_paid" ? "Rien payé" : "Payé intégralement"}` },
    filters.balance_min !== "" && { key: "balance_min", label: `Solde min. : ${filters.balance_min}` },
    filters.balance_max !== "" && { key: "balance_max", label: `Solde max. : ${filters.balance_max}` },
  ].filter(Boolean);

  return <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-gray-800"><Filter size={18} className="text-red-600" /><h2 className="font-semibold">Filtres composés</h2></div><button type="button" onClick={onReset} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600"><RotateCcw size={16} /> Réinitialiser</button></div>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      <label className="relative md:col-span-2"><Search size={17} className="absolute left-3 top-3 text-gray-400" /><input value={filters.search} onChange={(event) => onChange("search", event.target.value)} onKeyDown={(event) => event.key === "Enter" && onApply()} placeholder="Nom, prénom, classe ou téléphone du parent" className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" /></label>
      <select value={filters.school_class_id} onChange={(event) => onChange("school_class_id", event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2.5"><option value="">Toutes les classes</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select value={filters.academic_year_id} onChange={(event) => onChange("academic_year_id", event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2.5"><option value="">Toutes les années</option>{academicYears.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select value={filters.payment_status} onChange={(event) => onChange("payment_status", event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2.5"><option value="">Tous les paiements</option><option value="paid">À jour</option><option value="unpaid">Non payé</option><option value="partial">Paiement partiel</option><option value="overdue">En retard</option></select>
      <select value={filters.month} onChange={(event) => onChange("month", event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2.5"><option value="">Tous les mois</option>{months.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}</select>
      <select value={filters.fee_type} onChange={(event) => onChange("fee_type", event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2.5"><option value="all">Tous les frais</option><option value="registration">Frais d'inscription</option><option value="monthly">Écolage mensuel</option></select>
      <select value={filters.paid_state} onChange={(event) => onChange("paid_state", event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2.5"><option value="">Tous les montants</option><option value="has_balance">Solde restant</option><option value="paid">Payé intégralement</option><option value="nothing_paid">Rien payé</option></select>
      <input type="number" min="0" value={filters.balance_min} onChange={(event) => onChange("balance_min", event.target.value)} placeholder="Solde minimum" className="rounded-lg border border-gray-300 px-3 py-2.5" />
      <input type="number" min="0" value={filters.balance_max} onChange={(event) => onChange("balance_max", event.target.value)} placeholder="Solde maximum" className="rounded-lg border border-gray-300 px-3 py-2.5" />
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-2"><button type="button" onClick={onApply} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Appliquer les filtres</button>{active.map((item) => <span key={item.key} className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs text-red-700">{item.label}<button type="button" onClick={() => onRemove(item.key)} aria-label={`Retirer ${item.label}`}><X size={14} /></button></span>)}</div>
  </section>;
}
