import React, { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

// Données exemple
const examData = {
  Examen1: [
    { subject: "Maths", note: 14 },
    { subject: "Francais", note: 12 },
    { subject: "Physique", note: 15 },
    { subject: "SVT", note: 13 },
    { subject: "Histoire", note: 11 },
  ],
  Examen2: [
    { subject: "Maths", note: 16 },
    { subject: "Francais", note: 13 },
    { subject: "Physique", note: 14 },
    { subject: "SVT", note: 15 },
    { subject: "Histoire", note: 12 },
  ],
};

const averageData = [
  { exam: "Examen1", moyenne: 13 },
  { exam: "Examen2", moyenne: 14 },
];

export default function PerformanceVisual() {
  const [selectedExam, setSelectedExam] = useState("Examen1");

  return (
    <div className="space-y-6">
      {/* Sélection examen */}
      <div className="flex gap-3">
        {Object.keys(examData).map((exam) => (
          <button
            key={exam}
            onClick={() => setSelectedExam(exam)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedExam === exam
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {exam}
          </button>
        ))}
      </div>

      {/* Radar chart */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="h-80">
          <h3 className="text-lg font-semibold mb-3">Performance par matière</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={examData[selectedExam]}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 20]} />
              <Radar
                name="Note"
                dataKey="note"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Courbe moyenne */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="h-72">
          <h3 className="text-lg font-semibold mb-3">Évolution de la moyenne</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={averageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="exam" />
              <YAxis domain={[0, 20]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="moyenne"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
