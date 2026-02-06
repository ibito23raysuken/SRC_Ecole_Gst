import { useState, useRef, useContext, useEffect } from "react";
import { Camera, Save } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";

export default function EditableProfileImage({ student, setStudent }) {
  const { token } = useContext(AppContext);

  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    if (student?.student_image) {
      setPreview(`/storage/${student.student_image}`);
    }
  }, [student]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Le fichier doit être une image.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setEditing(true);
    setError("");
  };

  const handleSave = async () => {
    if (!file) return;

    try {
      const response = await updateStudentApi(
        student.id,
        { student_image: file },
        token
      );

      if (response.student) {
        setStudent(prev => ({
          ...prev,
          student_image: response.student.student_image
        }));
      }

      setEditing(false);
      setFile(null);
      setError("");

    } catch (err) {
      console.error(err);
      setError("Erreur lors du téléversement.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <img
          src={preview || "/placeholder.png"}
          alt="Photo"
          className="w-28 h-28 rounded-full object-cover border-4 border-red-500"
        />

        <button
          onClick={() => inputRef.current.click()}
          className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow"
        >
          <Camera className="w-5 h-5 text-red-600" />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {editing && (
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => {
              setEditing(false);
              setFile(null);
              setPreview(`/storage/${student.student_image}`);
            }}
            className="px-3 py-1 bg-gray-600 text-white rounded"
          >
            Annuler
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            <Save className="w-4 h-4 inline mr-1" />
            Sauvegarder
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
    </div>
  );
}
