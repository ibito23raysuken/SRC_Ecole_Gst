import { useState } from "react";
import { Save, Printer, ChevronDown, BookOpen, Users, Calendar, ClipboardList, AlertCircle } from "lucide-react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const DATA = {
  classes: {
    "6ème":        ["6ème A", "6ème B", "6ème C"],
    "5ème":        ["5ème A", "5ème B", "5ème C"],
    "4ème":        ["4ème A", "4ème B", "4ème C"],
    "3ème":        ["3ème A", "3ème B", "3ème C"],
    "2nde":        ["2nde A", "2nde B", "2nde C"],
    "1ère S":      ["1S1", "1S2"],
    "1ère L":      ["1L1", "1L2"],
    "1ère ES":     ["1ES1", "1ES2"],
    "Terminale S": ["TS1", "TS2"],
    "Terminale L": ["TL1"],
    "Terminale ES":["TES1", "TES2"],
  },
  eleves: {
    "6ème A": ["Adam Dupont","Sofia Ramirez","Lucas Martin","Emma Brun","Noah Leroy"],
    "6ème B": ["Inès Moreau","Théo Bernard","Jade Simon","Ethan Petit","Léa Robert"],
    "6ème C": ["Hugo Laurent","Chloé Girard","Mathis Thomas","Anaïs Mercier","Tom Blanc"],
    "5ème A": ["Camille Durand","Alexis Fontaine","Manon Legrand","Romain Chevalier","Julie Morin"],
    "5ème B": ["Antoine Rousseau","Pauline Garnier","Maxime Fournier","Lucie Morel","Pierre Denis"],
    "5ème C": ["Clara Lefebvre","Nathan Schmitt","Océane Perrin","Samuel Renard","Marine Boyer"],
    "4ème A": ["Florian Bertrand","Sarah Guillot","Julien Henry","Ambre Gauthier","Baptiste Leroux"],
    "4ème B": ["Charlotte Robin","Rayan Gaillard","Elisa Collin","Quentin Lambert","Lea Masson"],
    "4ème C": ["Thomas Giraud","Alice Perez","Paul Bonnet","Laura Dupuis","Victor Brunet"],
    "3ème A": ["Margaux Caron","Nicolas Lacroix","Inès Verdier","Axel Faure","Pauline Aubert"],
    "3ème B": ["Loic Blanchard","Julie Vasseur","Tristan Leclercq","Zoe Barre","Kevin Picard"],
    "3ème C": ["Laura Renaud","Mehdi Carpentier","Celia Nguyen","Dylan Marchal","Manon Andre"],
    "2nde A": ["Emma Leconte","Arthur Meunier","Jade Boulanger","Nathan Clement","Clara Charpentier"],
    "2nde B": ["Louis Hubert","Camille Vallee","Hugo Barbier","Sara Muller","Theo Pichon"],
    "2nde C": ["Pauline Arnaud","Remi Benoit","Elisa Diallo","Maxime Guerin","Alice Lamy"],
    "1S1":    ["Louis Favre","Emma Prevost","Nathan Jacquet","Lucie Michel","Pierre Leblanc"],
    "1S2":    ["Camille Arnoux","Hugo Perrot","Manon Dumas","Romain Vidal","Lea Huet"],
    "1L1":    ["Charlotte Brunel","Julien Lebrun","Marie Pons","Baptiste Thibault","Inès Ferrand"],
    "1L2":    ["Alexis Vallet","Clara Guillet","Thomas Cordier","Sarah Binet","Paul Lemaire"],
    "1ES1":   ["Laura Roussel","Antoine Picard","Elisa Marin","Quentin Lacombe","Jade Lepage"],
    "1ES2":   ["Romain Lacoste","Ambre Tissot","Florian Conte","Noemie Gros","Baptiste Leroi"],
    "TS1":    ["Antoine Dupre","Camille Barre","Hugo Gros","Lucie Poirier","Thomas Roux"],
    "TS2":    ["Emma Favier","Nicolas Lemoine","Sarah Baudry","Romain Deschamps","Alice Mallet"],
    "TL1":    ["Charlotte Laval","Julien Dumont","Manon Perrier","Baptiste Legros","Inès Riviere"],
    "TES1":   ["Alexis Colin","Clara Evrard","Thomas Pelletier","Sarah Guyon","Paul Laporte"],
    "TES2":   ["Laura Borel","Antoine Bousquet","Elisa Charrier","Quentin Navarro","Jade Lefevre"],
  },
  matieres: {
    "6ème":        ["Mathématiques","Français","Histoire-Géographie","Anglais","SVT","Éducation Physique","Arts Plastiques","Musique"],
    "5ème":        ["Mathématiques","Français","Histoire-Géographie","Anglais","SVT","Physique-Chimie","Éducation Physique","Arts Plastiques"],
    "4ème":        ["Mathématiques","Français","Histoire-Géographie","Anglais","Espagnol","SVT","Physique-Chimie","Éducation Physique"],
    "3ème":        ["Mathématiques","Français","Histoire-Géographie","Anglais","Espagnol","SVT","Physique-Chimie","Technologie","Éducation Physique"],
    "2nde":        ["Mathématiques","Français","Histoire-Géographie","Anglais","SVT","Physique-Chimie","SES","Éducation Physique"],
    "1ère S":      ["Mathématiques","Français","Physique-Chimie","SVT","Histoire-Géographie","Anglais","Philosophie","Éducation Physique"],
    "1ère L":      ["Français","Philosophie","Histoire-Géographie","Anglais","Mathématiques","SVT","Éducation Physique"],
    "1ère ES":     ["SES","Mathématiques","Français","Histoire-Géographie","Anglais","Philosophie","Éducation Physique"],
    "Terminale S": ["Mathématiques","Physique-Chimie","SVT","Philosophie","Histoire-Géographie","Anglais","Éducation Physique"],
    "Terminale L": ["Philosophie","Français","Histoire-Géographie","Anglais","Mathématiques","Éducation Physique"],
    "Terminale ES":["SES","Mathématiques","Philosophie","Histoire-Géographie","Anglais","Éducation Physique"],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getMention(avg) {
  if (avg === null) return { t: "—",           cls: "bg-gray-100 text-gray-500" };
  if (avg >= 16)   return { t: "Très Bien",    cls: "bg-green-100 text-green-800" };
  if (avg >= 14)   return { t: "Bien",         cls: "bg-green-50  text-green-700" };
  if (avg >= 12)   return { t: "Assez Bien",   cls: "bg-yellow-50 text-yellow-700" };
  if (avg >= 10)   return { t: "Passable",     cls: "bg-yellow-50 text-yellow-600" };
  return                   { t: "Insuffisant", cls: "bg-red-100   text-red-700" };
}
function getNoteCls(n) {
  if (n >= 16) return "bg-green-100 text-green-800";
  if (n >= 14) return "bg-green-50  text-green-700";
  if (n >= 12) return "bg-yellow-50 text-yellow-700";
  if (n >= 10) return "bg-yellow-50 text-yellow-600";
  return               "bg-red-100   text-red-700";
}
function getApprMatiere(n) {
  if (n >= 16) return "Excellent travail";
  if (n >= 14) return "Bon travail";
  if (n >= 12) return "Assez bien";
  if (n >= 10) return "Résultats passables";
  return "Insuffisant";
}
function getApprGen(avg) {
  if (avg === null) return "En attente des notes.";
  if (avg >= 16) return "Excellents résultats. Félicitations pour ce travail remarquable.";
  if (avg >= 14) return "Bons résultats. Élève sérieux(se) et investi(e). Continuez ainsi.";
  if (avg >= 12) return "Résultats satisfaisants. Des efforts réguliers permettront de progresser.";
  if (avg >= 10) return "Résultats passables. Un travail plus soutenu est nécessaire.";
  return "Résultats insuffisants. Des efforts importants sont indispensables.";
}

// ── Select component ──────────────────────────────────────────────────────────
function Select({ value, onChange, options, placeholder, disabled }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full appearance-none border border-gray-300 rounded px-3 py-2 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition
          ${disabled ? "opacity-40 cursor-not-allowed bg-gray-50" : "cursor-pointer hover:border-red-400"}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown
        size={14}
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${disabled ? "text-gray-300" : "text-red-600"}`}
      />
    </div>
  );
}

// ── Section Header (matches StudentCreate section style) ──────────────────────
function SectionHeader({ icon: Icon, stepNum, title }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
      <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {stepNum}
      </div>
      <Icon size={15} className="text-red-600" />
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">{title}</h3>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function NotesPage() {
  const [niveau, setNiveau] = useState("");
  const [classe, setClasse] = useState("");
  const [eleve,  setEleve]  = useState("");
  const [annee,  setAnnee]  = useState("2025–2026");
  const [trim,   setTrim]   = useState("1er Trimestre");
  const [notes,  setNotes]  = useState({});
  const [saveMsg, setSaveMsg] = useState("");

  const handleNiveau = (v) => { setNiveau(v); setClasse(""); setEleve(""); setNotes({}); };
  const handleClasse = (v) => { setClasse(v); setEleve(""); };

  const matieres    = niveau ? (DATA.matieres[niveau] ?? []) : [];
  const classes     = niveau ? (DATA.classes[niveau]  ?? []) : [];
  const elevesListe = classe ? (DATA.eleves[classe]   ?? []) : [];

  const calcAvg = () => {
    const vals = matieres.map((m) => parseFloat(notes[m])).filter((v) => !isNaN(v));
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };
  const avg     = calcAvg();
  const mention = getMention(avg);

  const handleSave = () => {
    if (!eleve || !classe) { setSaveMsg("⚠ Choisissez un élève et une classe."); return; }
    setSaveMsg("✓ Bulletin enregistré avec succès");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handlePrint = () => {
    const el = document.getElementById("bul-content");
    if (!el) return;
    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Bulletin</title>
      <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:sans-serif;padding:32px;max-width:700px;margin:0 auto}
      table{width:100%;border-collapse:collapse}th,td{padding:8px 10px;border-bottom:1px solid #eee;font-size:12px}
      thead{background:#dc2626;color:#fff}@media print{body{padding:12px}}</style>
      </head><body>${el.innerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  return (
    <div className="flex relative min-h-screen bg-gray-100 font-sans">

      {/* ── LEFT PANEL (form) ── */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">

        {/* Header */}
        <div className="bg-red-600 px-5 py-4">
          <h1 className="text-white font-semibold text-base">Gestion des Bulletins</h1>
          <p className="text-red-200 text-xs mt-0.5 uppercase tracking-widest">Année Scolaire</p>
        </div>

        <div className="p-5 space-y-6 flex-1">

          {/* Étape 1 – Niveau & Classe */}
          <div>
            <SectionHeader icon={BookOpen} stepNum={1} title="Niveau & Classe" />
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Niveau</label>
                <Select
                  value={niveau}
                  onChange={handleNiveau}
                  placeholder="— Choisir un niveau —"
                  options={Object.keys(DATA.classes)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Classe</label>
                <Select
                  value={classe}
                  onChange={handleClasse}
                  placeholder="— Choisir d'abord un niveau —"
                  options={classes}
                  disabled={!niveau}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Étape 2 – Élève */}
          <div>
            <SectionHeader icon={Users} stepNum={2} title="Élève" />
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Sélectionner l'élève</label>
              <Select
                value={eleve}
                onChange={setEleve}
                placeholder="— Choisir d'abord une classe —"
                options={elevesListe}
                disabled={!classe}
              />
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Étape 3 – Période */}
          <div>
            <SectionHeader icon={Calendar} stepNum={3} title="Période" />
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Année scolaire</label>
                <Select
                  value={annee}
                  onChange={setAnnee}
                  options={["2024–2025","2025–2026","2026–2027"]}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Trimestre</label>
                <Select
                  value={trim}
                  onChange={setTrim}
                  options={["1er Trimestre","2ème Trimestre","3ème Trimestre"]}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Étape 4 – Notes */}
          <div>
            <SectionHeader icon={ClipboardList} stepNum={4} title="Notes" />
            {!matieres.length ? (
              <p className="text-xs text-gray-400 italic">Choisissez un niveau pour voir les matières.</p>
            ) : (
              <div className="space-y-2">
                {matieres.map((m) => (
                  <div key={m} className="grid grid-cols-[1fr_80px] gap-2 items-center">
                    <span className="text-sm text-gray-700 truncate">{m}</span>
                    <input
                      type="number" min="0" max="20" step="0.5" placeholder="/20"
                      value={notes[m] ?? ""}
                      onChange={(e) => setNotes({ ...notes, [m]: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition w-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-gray-200 space-y-2">
          {saveMsg && (
            <p className={`text-xs text-center font-medium ${saveMsg.startsWith("⚠") ? "text-red-600" : "text-green-700"}`}>
              {saveMsg}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition"
            >
              <Save size={14} />
              Enregistrer
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-500 text-white rounded text-sm font-medium hover:bg-gray-600 transition"
            >
              <Printer size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── RIGHT PANEL (preview) ── */}
      <main className="flex-1 p-6 overflow-y-auto">

        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Aperçu — Bulletin de notes
        </p>

        {/* Bulletin card */}
        <div id="bul-content" className="bg-white border border-gray-200 rounded max-w-2xl shadow-sm">

          {!eleve && !niveau ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <AlertCircle size={32} className="text-gray-300" />
              <p className="text-sm">Remplissez le formulaire pour générer le bulletin.</p>
            </div>
          ) : (
            <>
              {/* Bulletin header */}
              <div className="bg-red-600 px-7 py-4 grid grid-cols-3 items-start gap-4">
                <div>
                  <p className="text-red-200 text-[10px] uppercase tracking-widest font-semibold leading-relaxed">
                    Établissement Scolaire<br />République Française
                  </p>
                </div>
                <div className="text-center">
                  <h2 className="text-white text-lg font-semibold italic">Bulletin de Notes</h2>
                  <p className="text-red-200 text-xs mt-0.5">{trim} · {annee}</p>
                </div>
                <div className="text-right text-white">
                  <p className="font-semibold text-sm">{eleve || "—"}</p>
                  <p className="text-red-200 text-xs">{classe ? `${classe} (${niveau})` : "—"}</p>
                  <p className="text-red-300 text-[10px]">{new Date().toLocaleDateString("fr-FR")}</p>
                </div>
              </div>

              {/* Meta info */}
              <div className="mx-7 mt-5 grid grid-cols-2 gap-3 bg-gray-50 border border-gray-200 rounded p-4">
                {[
                  ["Élève",   eleve || "—"],
                  ["Classe",  classe || "—"],
                  ["Niveau",  niveau || "—"],
                  ["Période", trim],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2 items-baseline">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{k} :</span>
                    <span className="text-sm font-semibold text-gray-800">{v}</span>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="px-7 mt-5">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-red-600 text-white">
                      <th className="text-left px-3 py-2.5 text-[10px] uppercase tracking-wider font-medium rounded-tl">Matière</th>
                      <th className="text-center px-3 py-2.5 text-[10px] uppercase tracking-wider font-medium w-20">Note</th>
                      <th className="text-left px-3 py-2.5 text-[10px] uppercase tracking-wider font-medium rounded-tr">Appréciation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!matieres.length ? (
                      <tr>
                        <td colSpan={3} className="px-3 py-3 text-gray-400 italic text-xs">
                          Aucune matière — choisissez un niveau.
                        </td>
                      </tr>
                    ) : matieres.map((m, i) => {
                      const raw = notes[m];
                      const n = raw !== undefined && raw !== "" && !isNaN(parseFloat(raw)) ? parseFloat(raw) : null;
                      return (
                        <tr key={m} className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-3 py-2 border-b border-gray-100 text-gray-800">{m}</td>
                          <td className="px-3 py-2 border-b border-gray-100 text-center">
                            {n !== null
                              ? <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getNoteCls(n)}`}>{n.toFixed(1)}</span>
                              : <span className="text-gray-300 text-xs">—</span>}
                          </td>
                          <td className="px-3 py-2 border-b border-gray-100 text-xs text-gray-500 italic">
                            {n !== null ? getApprMatiere(n) : ""}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="mx-7 mt-5 mb-6 grid grid-cols-[1fr_auto] gap-4 pt-4 border-t-2 border-red-600 items-end">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Appréciation générale</p>
                  <p className="text-sm italic text-gray-700 leading-relaxed">{getApprGen(avg)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Moyenne</p>
                  <p className="text-4xl font-light text-red-600 leading-none">
                    {avg !== null ? avg.toFixed(2) : "—"}
                    <span className="text-base opacity-40 ml-0.5">/20</span>
                  </p>
                  <span className={`inline-block mt-1.5 px-3 py-0.5 rounded text-xs font-semibold ${mention.cls}`}>
                    {mention.t}
                  </span>
                </div>
              </div>

              {/* Signatures */}
              <div className="mx-7 mb-7 grid grid-cols-2 gap-6">
                {["Signature du responsable légal", "Cachet et signature du directeur"].map((s) => (
                  <div key={s} className="border-t border-gray-200 pt-2 text-center text-[10px] text-gray-400">
                    {s}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Print button below */}
        <button
          onClick={handlePrint}
          className="mt-4 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition"
        >
          <Printer size={14} />
          Imprimer / Enregistrer en PDF
        </button>
      </main>
    </div>
  );
}
