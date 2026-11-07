export default function StatCard({ label, value, icon: Icon, tone = "red" }) {
  const tones = { red: "bg-red-50 text-red-700", slate: "bg-slate-50 text-slate-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700" };
  return <article className="app-card p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm text-slate-500">{label}</p>{Icon && <Icon size={22} className={tones[tone]?.split(" ")[1]} />}</div><p className={`mt-3 text-2xl font-bold ${tones[tone]?.split(" ")[1] || "text-slate-800"}`}>{value}</p></article>;
}
