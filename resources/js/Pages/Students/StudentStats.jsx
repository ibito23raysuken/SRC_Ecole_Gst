import { CheckCircle2, CircleDollarSign, GraduationCap, MinusCircle, Users } from "lucide-react";

const cards = [["total", "Total des élèves", Users, "text-gray-700"], ["paid", "À jour", CheckCircle2, "text-green-600"], ["unpaid", "Non payés", MinusCircle, "text-red-600"], ["partial", "Paiements partiels", CircleDollarSign, "text-amber-600"]];

export default function StudentStats({ stats, onStatus }) {
  return <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(([key, label, Icon, color]) => <button key={key} type="button" onClick={() => key !== "total" && onStatus(key)} className="rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center justify-between"><span className="text-sm text-gray-500">{label}</span><Icon size={20} className={color} /></div><p className="mt-2 text-2xl font-bold text-gray-800">{stats?.[key] ?? 0}</p></button>)}<div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-gray-500">Total restant</span><GraduationCap size={20} className="text-red-600" /></div><p className="mt-2 text-xl font-bold text-gray-800">{Number(stats?.total_balance || 0).toLocaleString("fr-FR")} MGA</p></div></div>;
}
