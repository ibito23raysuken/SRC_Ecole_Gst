import { useState, useContext } from "react";
import { Edit3, Save } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";

export default function GradeLevelEditable({ value, student }) {

    const { token } = useContext(AppContext);
    const [isEditing, setIsEditing] = useState(false);

    const classes = [
        "PS","MS","GS",
        "CP","CE1","CE2",
        "CM1","CM2",
        "6e","5e","4e","3e",
        "2nde","1ère","Term"
    ];

    const [gradeLevel, setGradeLevel] = useState(student.grade_level);

    const handleSave = async () => {

        console.log("Saving grade level:", gradeLevel);
        await updateStudentApi(student.id, {
            grade_level: gradeLevel
        }, token);

        setIsEditing(false);
    };
    return (
        <div>
            {isEditing ? (
                <div className="flex gap-2 items-center">

                    <select
                        className="border p-2 rounded"
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(e.target.value)}
                    >
                        {classes.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>


                    <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-red-600 text-white rounded-md"
                    >
                        <Save className="inline-block w-4 h-4 mr-1" />
                        Sauvegarder
                    </button>

                    <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                        Annuler
                    </button>

                </div>
            ) : (
                <span
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium cursor-pointer hover:bg-red-200"
                    onClick={() => setIsEditing(true)}
                >
                    {gradeLevel}
                </span>
            )}
        </div>
    );
}
