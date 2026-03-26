import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { getAllSchoolClassesApi } from "../../api/apiSchoolClasses";
import { getSubjectsApi } from "../../api/apiSubjects";
import { saveScheduleApi, getScheduleApi } from "../../api/apiSchedules";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const hours = [
  "08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00"
];

const subjectColors = {
  Math: "bg-blue-100",
  Physique: "bg-green-100",
  SVT: "bg-yellow-100",
  Français: "bg-purple-100",
  Anglais: "bg-pink-100",
};

export default function ScheduleFullDay() {
  const { token } = useContext(AppContext);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [toast, setToast] = useState(null);

  // 🔹 Charger classes et matières
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      const cls = await getAllSchoolClassesApi(token);
      setClasses(cls);
      const subjs = await getSubjectsApi(token);
      setSubjects(subjs.map(s => s.name));
    };
    fetchData();
  }, [token]);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 🔹 Normaliser les horaires H:i
  const formatHour = (hour) => {
    const [h, m] = hour.split(":");
    const hh = h.padStart(2, "0");
    const mm = m.padStart(2, "0");
    return `${hh}:${mm}`;
  };

  // 🔹 Charger emploi du temps existant pour la classe
  const loadSchedule = async (cls) => {
    if (!cls) return setSchedule({});
    try {
      const existingSchedule = await getScheduleApi(token, cls.id);
      const newSchedule = {};
      existingSchedule.forEach(cell => {
        const start = formatHour(cell.start);
        const end = formatHour(cell.end);
        const startIdx = hours.indexOf(start);
        const endIdx = hours.indexOf(end);
        if (startIdx !== -1 && endIdx !== -1) {
          newSchedule[`${cell.day}-${startIdx}`] = {
            day: cell.day,
            start,
            end,
            subject: cell.subject
          };
        }
      });
      setSchedule(newSchedule);
    } catch (err) {
      console.error(err);
      setSchedule({});
    }
  };

  // 🔹 Ajouter ou mettre à jour un créneau
  const updateSlot = (day, startIdx, endIdx, subject) => {
    if (!subject || startIdx >= endIdx) return;
    const newSchedule = { ...schedule };

    // Supprimer les créneaux qui se chevauchent
    Object.keys(newSchedule).forEach(key => {
      if (!key.startsWith(day)) return;
      const cell = newSchedule[key];
      const s = hours.indexOf(cell.start);
      const e = hours.indexOf(cell.end);
      if (startIdx < e && endIdx > s) delete newSchedule[key];
    });

    // Ajouter le nouveau créneau
    const key = `${day}-${startIdx}`;
    newSchedule[key] = {
      day,
      start: hours[startIdx],
      end: hours[endIdx],
      subject
    };
    setSchedule(newSchedule);
  };

  const getRowSpan = (day, startIdx) => {
    const cell = schedule[`${day}-${startIdx}`];
    if (!cell) return 1;
    return hours.indexOf(cell.end) - hours.indexOf(cell.start);
  };

  const shouldHideCell = (day, i) => {
    return Object.values(schedule).some(cell => {
      const s = hours.indexOf(cell.start);
      const e = hours.indexOf(cell.end);
      return cell.day === day && i > s && i < e;
    });
  };

  // 🔹 Sauvegarder tout le planning
  const handleSave = async () => {
    if (!selectedClass) return showToast("Sélectionnez une classe", "error");

    const payload = Object.values(schedule).map(cell => ({
      day: cell.day,
      subject: cell.subject,
      start: formatHour(cell.start),
      end: formatHour(cell.end)
    }));

    try {
      await saveScheduleApi(token, selectedClass.id, payload);
      showToast("Emploi du temps enregistré !");
    } catch (err) {
      console.error(err.response?.data || err);
      showToast("Erreur lors de la sauvegarde", "error");
    }
  };

  return (
    <div className="min-h-screen bg-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Sélection classe */}
        <div className="mb-6 flex items-center gap-4">
          <label className="font-semibold text-red-800">Classe :</label>
          <select
            value={selectedClass?.id || ""}
            onChange={async e => {
              const cls = classes.find(c => c.id === parseInt(e.target.value));
              setSelectedClass(cls);
              await loadSchedule(cls);
            }}
            className="p-2 border rounded-lg"
          >
            <option value="">-- Choisir une classe --</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button
            onClick={handleSave}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            💾 Sauvegarder
          </button>
        </div>

        {/* Tableau emploi du temps */}
        <div className="bg-white rounded-xl shadow-md overflow-auto">
          <table className="min-w-full border border-red-100 text-center">
            <thead className="bg-red-50">
              <tr>
                <th className="border p-3">Heures</th>
                {days.map(day => <th key={day} className="border p-3">{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour, i) => (
                <tr key={i} className="hover:bg-red-50">
                  <td className="border p-2">{hour}-{hours[i+1] || "Fin"}</td>
                  {days.map(day => {
                    if (shouldHideCell(day, i)) return null;
                    const key = `${day}-${i}`;
                    const cell = schedule[key];
                    return (
                      <td
                        key={day}
                        rowSpan={cell ? getRowSpan(day, i) : 1}
                        className={`border p-2 align-middle ${cell ? subjectColors[cell.subject] : ""} rounded-lg`}
                      >
                        <div className="flex flex-col gap-1 items-center">
                          {/* Matière */}
                          <select
                            className="w-full p-1 text-sm border border-red-200 rounded-lg bg-white"
                            value={cell?.subject || ""}
                            onChange={e => {
                              const subject = e.target.value;
                              const startIdx = i;
                              const endIdx = cell ? hours.indexOf(cell.end) : startIdx + 1;
                              updateSlot(day, startIdx, endIdx, subject);
                            }}
                          >
                            <option value="">📘 Matière</option>
                            {subjects.map(s => <option key={s}>{s}</option>)}
                          </select>

                          {/* Début/Fin */}
                          {cell && (
                            <div className="flex items-center gap-1 text-xs mt-1">
                              <select
                                value={hours.indexOf(cell.start)}
                                onChange={e => {
                                  const newStart = parseInt(e.target.value);
                                  const endIdx = hours.indexOf(cell.end);
                                  updateSlot(day, newStart, endIdx, cell.subject);
                                }}
                              >
                                {hours.map((_, idx) => idx < hours.indexOf(cell.end) &&
                                  <option key={idx} value={idx}>{hours[idx]}</option>
                                )}
                              </select>
                              <span className="font-bold">→</span>
                              <select
                                value={hours.indexOf(cell.end)}
                                onChange={e => {
                                  const newEnd = parseInt(e.target.value);
                                  const startIdx = hours.indexOf(cell.start);
                                  updateSlot(day, startIdx, newEnd, cell.subject);
                                }}
                              >
                                {hours.map((_, idx) => idx > hours.indexOf(cell.start) &&
                                  <option key={idx} value={idx}>{hours[idx]}</option>
                                )}
                              </select>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
