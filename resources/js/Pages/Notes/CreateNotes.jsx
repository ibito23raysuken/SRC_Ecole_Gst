import { useState } from "react";

const DATA = {
  classes: {
    "6ème": ["6ème A", "6ème B", "6ème C"],
    "5ème": ["5ème A", "5ème B", "5ème C"],
    "4ème": ["4ème A", "4ème B", "4ème C"],
    "3ème": ["3ème A", "3ème B", "3ème C"],
    "2nde": ["2nde A", "2nde B", "2nde C"],
    "1ère S": ["1S1", "1S2"],
    "1ère L": ["1L1", "1L2"],
    "1ère ES": ["1ES1", "1ES2"],
    "Terminale S": ["TS1", "TS2"],
    "Terminale L": ["TL1"],
    "Terminale ES": ["TES1", "TES2"],
  },
  eleves: {
    "6ème A": ["Adam Dupont", "Sofia Ramirez", "Lucas Martin", "Emma Brun", "Noah Leroy"],
    "6ème B": ["Inès Moreau", "Théo Bernard", "Jade Simon", "Ethan Petit", "Léa Robert"],
    "6ème C": ["Hugo Laurent", "Chloé Girard", "Mathis Thomas", "Anaïs Mercier", "Tom Blanc"],
    "5ème A": ["Camille Durand", "Alexis Fontaine", "Manon Legrand", "Romain Chevalier", "Julie Morin"],
    "5ème B": ["Antoine Rousseau", "Pauline Garnier", "Maxime Fournier", "Lucie Morel", "Pierre Denis"],
    "5ème C": ["Clara Lefebvre", "Nathan Schmitt", "Océane Perrin", "Samuel Renard", "Marine Boyer"],
    "4ème A": ["Florian Bertrand", "Sarah Guillot", "Julien Henry", "Ambre Gauthier", "Baptiste Leroux"],
    "4ème B": ["Charlotte Robin", "Rayan Gaillard", "Elisa Collin", "Quentin Lambert", "Lea Masson"],
    "4ème C": ["Thomas Giraud", "Alice Perez", "Paul Bonnet", "Laura Dupuis", "Victor Brunet"],
    "3ème A": ["Margaux Caron", "Nicolas Lacroix", "Inès Verdier", "Axel Faure", "Pauline Aubert"],
    "3ème B": ["Loic Blanchard", "Julie Vasseur", "Tristan Leclercq", "Zoe Barre", "Kevin Picard"],
    "3ème C": ["Laura Renaud", "Mehdi Carpentier", "Celia Nguyen", "Dylan Marchal", "Manon Andre"],
    "2nde A": ["Emma Leconte", "Arthur Meunier", "Jade Boulanger", "Nathan Clement", "Clara Charpentier"],
    "2nde B": ["Louis Hubert", "Camille Vallee", "Hugo Barbier", "Sara Muller", "Theo Pichon"],
    "2nde C": ["Pauline Arnaud", "Remi Benoit", "Elisa Diallo", "Maxime Guerin", "Alice Lamy"],
    "1S1": ["Louis Favre", "Emma Prevost", "Nathan Jacquet", "Lucie Michel", "Pierre Leblanc"],
    "1S2": ["Camille Arnoux", "Hugo Perrot", "Manon Dumas", "Romain Vidal", "Lea Huet"],
    "1L1": ["Charlotte Brunel", "Julien Lebrun", "Marie Pons", "Baptiste Thibault", "Inès Ferrand"],
    "1L2": ["Alexis Vallet", "Clara Guillet", "Thomas Cordier", "Sarah Binet", "Paul Lemaire"],
    "1ES1": ["Laura Roussel", "Antoine Picard", "Elisa Marin", "Quentin Lacombe", "Jade Lepage"],
    "1ES2": ["Romain Lacoste", "Ambre Tissot", "Florian Conte", "Noemie Gros", "Baptiste Leroi"],
    "TS1": ["Antoine Dupre", "Camille Barre", "Hugo Gros", "Lucie Poirier", "Thomas Roux"],
    "TS2": ["Emma Favier", "Nicolas Lemoine", "Sarah Baudry", "Romain Deschamps", "Alice Mallet"],
    "TL1": ["Charlotte Laval", "Julien Dumont", "Manon Perrier", "Baptiste Legros", "Inès Riviere"],
    "TES1": ["Alexis Colin", "Clara Evrard", "Thomas Pelletier", "Sarah Guyon", "Paul Laporte"],
    "TES2": ["Laura Borel", "Antoine Bousquet", "Elisa Charrier", "Quentin Navarro", "Jade Lefevre"],
  },
  matieres: {
    "6ème": ["Mathématiques", "Français", "Histoire-Géographie", "Anglais", "SVT", "Éducation Physique", "Arts Plastiques", "Musique"],
    "5ème": ["Mathématiques", "Français", "Histoire-Géographie", "Anglais", "SVT", "Physique-Chimie", "Éducation Physique", "Arts Plastiques"],
    "4ème": ["Mathématiques", "Français", "Histoire-Géographie", "Anglais", "Espagnol", "SVT", "Physique-Chimie", "Éducation Physique"],
    "3ème": ["Mathématiques", "Français", "Histoire-Géographie", "Anglais", "Espagnol", "SVT", "Physique-Chimie", "Technologie", "Éducation Physique"],
    "2nde": ["Mathématiques", "Français", "Histoire-Géographie", "Anglais", "SVT", "Physique-Chimie", "SES", "Éducation Physique"],
    "1ère S": ["Mathématiques", "Français", "Physique-Chimie", "SVT", "Histoire-Géographie", "Anglais", "Philosophie", "Éducation Physique"],
    "1ère L": ["Français", "Philosophie", "Histoire-Géographie", "Anglais", "Mathématiques", "SVT", "Éducation Physique"],
    "1ère ES": ["SES", "Mathématiques", "Français", "Histoire-Géographie", "Anglais", "Philosophie", "Éducation Physique"],
    "Terminale S": ["Mathématiques", "Physique-Chimie", "SVT", "Philosophie", "Histoire-Géographie", "Anglais", "Éducation Physique"],
    "Terminale L": ["Philosophie", "Français", "Histoire-Géographie", "Anglais", "Mathématiques", "Éducation Physique"],
    "Terminale ES": ["SES", "Mathématiques", "Philosophie", "Histoire-Géographie", "Anglais", "Éducation Physique"],
  },
};

// ── Thème Rouge ───────────────────────────────────────────────────────────────
const T = {
  primary:      "#8b1a1a",
  primaryDark:  "#6b1212",
  primaryLight: "#fdf4f4",
  paper:        "#fffaf9",
  cream:        "#f7eeee",
  border:       "#ddb8b8",
  muted:        "#8a5252",
  ink:          "#1a0808",
};

function getMention(avg) {
  if (avg === null) return { t: "—",           bg: "#f5f5f5", c: "#999"    };
  if (avg >= 16)   return { t: "Très Bien",    bg: "#dcfce7", c: "#14532d" };
  if (avg >= 14)   return { t: "Bien",         bg: "#bbf7d0", c: "#166534" };
  if (avg >= 12)   return { t: "Assez Bien",   bg: "#fef3c7", c: "#92400e" };
  if (avg >= 10)   return { t: "Passable",     bg: "#fef9c3", c: "#713f12" };
  return                   { t: "Insuffisant", bg: "#fee2e2", c: "#991b1b" };
}
function getNotePill(n) {
  if (n >= 16) return { bg: "#dcfce7", c: "#14532d" };
  if (n >= 14) return { bg: "#bbf7d0", c: "#166534" };
  if (n >= 12) return { bg: "#fef3c7", c: "#92400e" };
  if (n >= 10) return { bg: "#fef9c3", c: "#713f12" };
  return               { bg: "#fee2e2", c: "#991b1b" };
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

const S = {
  page:        { fontFamily: "'DM Sans', sans-serif", background: T.cream, minHeight: "100vh", color: T.ink },
  header:      { background: T.primary, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#fff", fontWeight: 400 },
  headerSub:   { fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "1px", textTransform: "uppercase" },
  main:        { display: "grid", gridTemplateColumns: "370px 1fr", minHeight: "calc(100vh - 53px)" },

  left:        { background: "#fff", borderRight: `1px solid ${T.border}`, padding: "24px 20px", overflowY: "auto" },
  stepHeader:  { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  stepNum:     { width: 22, height: 22, borderRadius: "50%", background: T.primary, color: "#fff", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  stepLabel:   { fontSize: 11, fontWeight: 600, letterSpacing: "1.1px", textTransform: "uppercase", color: T.muted },
  stepBlock:   { marginBottom: 20 },
  label:       { display: "block", fontSize: 12, color: T.muted, marginBottom: 3, marginTop: 8, fontWeight: 500 },
  select:      { width: "100%", padding: "8px 32px 8px 10px", border: `1px solid ${T.border}`, borderRadius: 4, background: T.paper, color: T.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 13, appearance: "none", cursor: "pointer" },
  selectDis:   { opacity: 0.4, cursor: "not-allowed" },
  divider:     { height: 1, background: T.border, margin: "16px 0" },
  noteRow:     { display: "grid", gridTemplateColumns: "1fr 88px", gap: 8, alignItems: "center", marginBottom: 6 },
  noteLabel:   { fontSize: 13, color: T.ink },
  noteInput:   { padding: "6px 8px", border: `1px solid ${T.border}`, borderRadius: 4, background: T.paper, fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "center", width: "100%" },
  saveBtn:     { width: "100%", marginTop: 16, padding: 10, background: T.primary, color: "#fff", border: "none", borderRadius: 4, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  saveMsg:     { textAlign: "center", fontSize: 12, color: "#166534", marginTop: 6, minHeight: 16, fontWeight: 500 },

  right:        { background: T.primaryLight, padding: "28px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" },
  previewLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: T.muted },
  printBtn:     { padding: "9px 18px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: 4, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.ink, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, alignSelf: "flex-start" },

  bulletin:    { background: "#fff", border: `1px solid ${T.border}`, borderRadius: 2, padding: "28px 32px", fontFamily: "'DM Serif Display', serif", color: T.ink, maxWidth: 660 },
  bulHeader:   { display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 14, alignItems: "start", paddingBottom: 14, borderBottom: `2px solid ${T.primary}`, marginBottom: 16 },
  bulSchool:   { fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: T.muted, lineHeight: 1.7 },
  bulCenter:   { textAlign: "center" },
  bulTitle:    { fontSize: 20, fontStyle: "italic", color: T.primary },
  bulSubtitle: { fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.muted, marginTop: 2 },
  bulRight:    { textAlign: "right", fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.muted, lineHeight: 1.8 },
  bulMeta:     { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16, padding: "12px 14px", background: T.paper, border: `1px solid ${T.border}`, borderRadius: 4, fontFamily: "'DM Sans', sans-serif", fontSize: 12 },
  bulMetaItem: { display: "flex", gap: 5, alignItems: "baseline" },
  bulMetaKey:  { fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: ".5px", fontWeight: 500 },
  bulMetaVal:  { fontWeight: 600, color: T.ink },
  table:       { width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 14 },
  thead:       { background: T.primary },
  th:          { padding: "8px 10px", textAlign: "left", color: "#fff", fontWeight: 500, fontSize: 10, letterSpacing: ".6px", textTransform: "uppercase" },
  td:          { padding: "7px 10px", borderBottom: `1px solid ${T.cream}`, color: T.ink },
  tdEven:      { padding: "7px 10px", borderBottom: `1px solid ${T.cream}`, background: T.paper, color: T.ink },
  notePill:    { display: "inline-block", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600 },
  bulFooter:   { display: "grid", gridTemplateColumns: "1fr auto", gap: 14, alignItems: "end", borderTop: `2px solid ${T.primary}`, paddingTop: 12, marginTop: 4 },
  apprLabel:   { fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".6px", color: T.muted, marginBottom: 4 },
  apprText:    { fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontStyle: "italic", lineHeight: 1.5 },
  avgBlock:    { textAlign: "right" },
  avgLabel:    { fontFamily: "'DM Sans', sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: ".6px", color: T.muted, marginBottom: 3 },
  avgVal:      { fontSize: 30, letterSpacing: -1, lineHeight: 1, color: T.primary },
  mentionBadge:{ display: "inline-block", padding: "3px 12px", borderRadius: 2, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, marginTop: 5 },
  sigGrid:     { marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: T.muted },
  sigBox:      { borderTop: `1px solid ${T.border}`, paddingTop: 5, textAlign: "center" },
  placeholder: { textAlign: "center", padding: "50px 20px", color: T.muted, fontFamily: "'DM Sans', sans-serif" },
};

// ── Composant Select réutilisable ─────────────────────────────────────────────
function Sel({ value, disabled, onChange, placeholder, options = [] }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        style={{ ...S.select, ...(disabled ? S.selectDis : {}) }}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg width="10" height="6" viewBox="0 0 10 6"
        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: disabled ? 0.25 : 0.65 }}>
        <path d="M0 0l5 6 5-6z" fill={T.primary} />
      </svg>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function NotesPage() {
  const [niveau, setNiveau] = useState("");
  const [classe, setClasse] = useState("");
  const [eleve,  setEleve]  = useState("");
  const [annee,  setAnnee]  = useState("2025–2026");
  const [trim,   setTrim]   = useState("1er Trimestre");
  const [notes,  setNotes]  = useState({});
  const [saveMsg,setSaveMsg]= useState("");

  const handleNiveau = (v) => { setNiveau(v); setClasse(""); setEleve(""); setNotes({}); };
  const handleClasse = (v) => { setClasse(v); setEleve(""); };

  const matieres    = niveau && DATA.matieres[niveau] ? DATA.matieres[niveau] : [];
  const classes     = niveau && DATA.classes[niveau]  ? DATA.classes[niveau]  : [];
  const elevesListe = classe && DATA.eleves[classe]   ? DATA.eleves[classe]   : [];

  const calcAvg = () => {
    const vals = matieres.map((m) => parseFloat(notes[m])).filter((v) => !isNaN(v));
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const avg     = calcAvg();
  const mention = getMention(avg);

  const handleSave = () => {
    if (!eleve || !classe) { setSaveMsg("Choisissez un élève et une classe."); return; }
    setSaveMsg("Bulletin enregistré avec succès ✓");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handlePrint = () => {
    const el = document.getElementById("bul-content");
    if (!el) return;
    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Bulletin</title>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
      <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;padding:32px;max-width:700px;margin:0 auto}@media print{body{padding:12px}}</style>
      </head><body>${el.innerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div style={S.page}>

        {/* Header */}
        <header style={S.header}>
          <span style={S.headerTitle}>Gestion des Bulletins</span>
          <span style={S.headerSub}>Année Scolaire</span>
        </header>

        <div style={S.main}>

          {/* ── GAUCHE ── */}
          <aside style={S.left}>

            {/* Étape 1 */}
            <div style={S.stepBlock}>
              <div style={S.stepHeader}>
                <div style={S.stepNum}>1</div>
                <span style={S.stepLabel}>Niveau &amp; Classe</span>
              </div>
              <label style={S.label}>Niveau</label>
              <Sel value={niveau} disabled={false} onChange={handleNiveau}
                placeholder="— Choisir un niveau —" options={Object.keys(DATA.classes)} />
              <label style={S.label}>Classe</label>
              <Sel value={classe} disabled={!niveau} onChange={handleClasse}
                placeholder="— Choisir d'abord un niveau —" options={classes} />
            </div>

            <div style={S.divider} />

            {/* Étape 2 */}
            <div style={S.stepBlock}>
              <div style={S.stepHeader}>
                <div style={S.stepNum}>2</div>
                <span style={S.stepLabel}>Élève</span>
              </div>
              <label style={S.label}>Sélectionner l'élève</label>
              <Sel value={eleve} disabled={!classe} onChange={setEleve}
                placeholder="— Choisir d'abord une classe —" options={elevesListe} />
            </div>

            <div style={S.divider} />

            {/* Étape 3 */}
            <div style={S.stepBlock}>
              <div style={S.stepHeader}>
                <div style={S.stepNum}>3</div>
                <span style={S.stepLabel}>Période</span>
              </div>
              <label style={S.label}>Année scolaire</label>
              <Sel value={annee} disabled={false} onChange={setAnnee}
                options={["2024–2025", "2025–2026", "2026–2027"]} />
              <label style={S.label}>Trimestre</label>
              <Sel value={trim} disabled={false} onChange={setTrim}
                options={["1er Trimestre", "2ème Trimestre", "3ème Trimestre"]} />
            </div>

            <div style={S.divider} />

            {/* Étape 4 */}
            <div style={S.stepBlock}>
              <div style={S.stepHeader}>
                <div style={S.stepNum}>4</div>
                <span style={S.stepLabel}>Notes</span>
              </div>
              {!matieres.length ? (
                <p style={{ fontSize: 13, color: T.muted, fontStyle: "italic" }}>
                  Choisissez un niveau pour voir les matières.
                </p>
              ) : matieres.map((m) => (
                <div key={m} style={S.noteRow}>
                  <span style={S.noteLabel}>{m}</span>
                  <input
                    type="number" min="0" max="20" step="0.5" placeholder="/20"
                    style={S.noteInput}
                    value={notes[m] ?? ""}
                    onChange={(e) => setNotes({ ...notes, [m]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <button style={S.saveBtn} onClick={handleSave}>Enregistrer le bulletin</button>
            <div style={S.saveMsg}>{saveMsg}</div>
          </aside>

          {/* ── DROITE ── */}
          <main style={S.right}>
            <div style={S.previewLabel}>Aperçu — Bulletin de notes</div>

            <div style={S.bulletin} id="bul-content">
              {!eleve && !niveau ? (
                <div style={S.placeholder}>
                  <p style={{ fontSize: 14 }}>Remplissez le formulaire pour générer le bulletin.</p>
                </div>
              ) : (
                <>
                  {/* En-tête */}
                  <div style={S.bulHeader}>
                    <div style={S.bulSchool}>Établissement Scolaire<br />République Française</div>
                    <div style={S.bulCenter}>
                      <div style={S.bulTitle}>Bulletin de Notes</div>
                      <div style={S.bulSubtitle}>{trim} · {annee}</div>
                    </div>
                    <div style={S.bulRight}>
                      <strong style={{ color: T.ink, fontWeight: 600 }}>{eleve || "—"}</strong><br />
                      {classe ? `${classe} (${niveau})` : "—"}<br />
                      <span style={{ fontSize: 10 }}>{new Date().toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>

                  {/* Méta */}
                  <div style={S.bulMeta}>
                    <div style={S.bulMetaItem}><span style={S.bulMetaKey}>Élève :</span><span style={S.bulMetaVal}>{eleve || "—"}</span></div>
                    <div style={S.bulMetaItem}><span style={S.bulMetaKey}>Classe :</span><span style={S.bulMetaVal}>{classe || "—"}</span></div>
                    <div style={S.bulMetaItem}><span style={S.bulMetaKey}>Niveau :</span><span style={S.bulMetaVal}>{niveau || "—"}</span></div>
                    <div style={S.bulMetaItem}><span style={S.bulMetaKey}>Période :</span><span style={S.bulMetaVal}>{trim}</span></div>
                  </div>

                  {/* Tableau */}
                  <table style={S.table}>
                    <thead style={S.thead}>
                      <tr>
                        <th style={S.th}>Matière</th>
                        <th style={{ ...S.th, textAlign: "center", width: 70 }}>Note</th>
                        <th style={{ ...S.th, width: 130 }}>Appréciation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!matieres.length ? (
                        <tr><td colSpan={3} style={{ ...S.td, color: T.muted, fontStyle: "italic" }}>Aucune matière — choisissez un niveau.</td></tr>
                      ) : matieres.map((m, i) => {
                        const v = notes[m];
                        const n = v !== undefined && v !== "" && !isNaN(parseFloat(v)) ? parseFloat(v) : null;
                        const pill = n !== null ? getNotePill(n) : null;
                        const tdS = i % 2 === 1 ? S.tdEven : S.td;
                        return (
                          <tr key={m}>
                            <td style={tdS}>{m}</td>
                            <td style={{ ...tdS, textAlign: "center" }}>
                              {n !== null
                                ? <span style={{ ...S.notePill, background: pill.bg, color: pill.c }}>{n.toFixed(1)}</span>
                                : <span style={{ color: "#ccc" }}>—</span>}
                            </td>
                            <td style={{ ...tdS, fontSize: 11, color: T.muted, fontStyle: "italic" }}>
                              {n !== null ? getApprMatiere(n) : ""}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Pied */}
                  <div style={S.bulFooter}>
                    <div>
                      <div style={S.apprLabel}>Appréciation générale</div>
                      <div style={S.apprText}>{getApprGen(avg)}</div>
                    </div>
                    <div style={S.avgBlock}>
                      <div style={S.avgLabel}>Moyenne</div>
                      <div style={S.avgVal}>
                        {avg !== null ? avg.toFixed(2) : "—"}
                        <span style={{ fontSize: 14, opacity: 0.4 }}>/20</span>
                      </div>
                      <span style={{ ...S.mentionBadge, background: mention.bg, color: mention.c }}>
                        {mention.t}
                      </span>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div style={S.sigGrid}>
                    <div style={S.sigBox}>Signature du responsable légal</div>
                    <div style={S.sigBox}>Cachet et signature du directeur</div>
                  </div>
                </>
              )}
            </div>

            <button style={S.printBtn} onClick={handlePrint}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Imprimer / Enregistrer en PDF
            </button>
          </main>
        </div>
      </div>
    </>
  );
}
