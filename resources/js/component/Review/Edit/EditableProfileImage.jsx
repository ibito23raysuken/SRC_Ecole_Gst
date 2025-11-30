import { useState, useRef, useContext } from "react";
import { Camera, Save } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";

export default function EditableProfileImage({ student, setStudent }) {
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(`/storage/${student.student_image}`);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const inputFileRef = useRef(null);
  const { token } = useContext(AppContext);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Le fichier doit être une image.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError("");
    setEditing(true);
  };

  const handleSave = async () => {
  if (!file) {
    setError("Veuillez sélectionner une image.");
    return;
  }

  try {
    const response = await updateStudentApi(student.id, { student_image: file }, token);

    if (!response.student) {
      setError("Erreur : étudiant non retourné par le serveur.");
      return;
    }

    setStudent((prev) => ({
      ...prev,
      student_image: response.student.student_image,
    }));

    setPreview(response.student.student_image_url || `/storage/${response.student.student_image}`);
    setEditing(false);
    setError("");

  } catch (e) {
    console.error("Erreur upload :", e);
    setError("Erreur lors du téléversement.");
  }
};


  return (
    <div className="flex flex-col items-center">
      {/* IMAGE */}
      <div className="relative w-28 h-28">
        <img
          src={preview}
          alt="Photo"
          className="w-28 h-28 rounded-full object-cover border-4 border-red-500 shadow-md"
        />

        {/* BOUTON CAMERA */}
        <button
          onClick={() => inputFileRef.current.click()}
          className="
            absolute bottom-0 right-0
            bg-white rounded-full p-2 shadow-md
            hover:bg-gray-100 transition
          "
        >
          <Camera className="w-5 h-5 text-red-600" />
        </button>

        {/* INPUT FILE HIDDEN */}
        <input
          type="file"
          ref={inputFileRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* BOUTONS DE SAUVEGARDE */}
      {editing && (
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => {
              setEditing(false);
              setPreview(`/storage/${student.student_image}`);
              setFile(null);
            }}
            className="bg-gray-600 text-white px-3 py-1 rounded-md"
          >
            Annuler
          </button>

          <button
            onClick={handleSave}
            className="bg-red-600 text-white px-3 py-1 rounded-md"
          >
            <Save className="w-4 h-4 inline-block mr-1" />
            Sauvegarder
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
    </div>
  );
}
