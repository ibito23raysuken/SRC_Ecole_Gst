// PerformanceSection.jsx
import React from "react";
import Section from "../Section/section";
import EditableField from "../Edit/EditableField";

export default function SectionPerformance({ student }) {
    return (
        <Section title="Performance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Notes récentes */}
                <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-800 mb-4">Notes récentes</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {student.grades && Object.entries(student.grades).map(([subject, grade], idx) => (
                            <SubjectGrade key={idx} subject={subject} grade={grade} />
                        ))}
                    </div>
                </div>

                {/* Assiduité */}
                <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-800 mb-4">Assiduité</h3>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700">Taux de présence</span>
                            <span className="font-medium text-red-700">
                                {student.attendance || 0}%
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="h-2.5 rounded-full bg-red-600"
                                style={{ width: `${student.attendance || 0}%` }}
                            ></div>
                        </div>

                        <p className="mt-3 text-sm text-gray-600">
                            {student.attendance > 90
                                ? "Excellente assiduité"
                                : student.attendance > 80
                                    ? "Bonne assiduité"
                                    : "Assiduité à améliorer"}
                        </p>
                    </div>
                </div>

            </div>
        </Section>
    );
}
// Affichage des notes
function SubjectGrade({ subject, grade }) {
    const getGradeColor = (grade) => {
        if (grade >= 16) return 'text-green-600';
        if (grade >= 14) return 'text-green-500';
        if (grade >= 12) return 'text-yellow-600';
        if (grade >= 10) return 'text-orange-500';
        return 'text-red-600';
    };
    return (
        <div className="border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-gray-700 mb-2 capitalize">{subject}</p>
            <div className={`text-2xl font-bold ${getGradeColor(grade)}`}>{grade}/20</div>
        </div>
    );
}
