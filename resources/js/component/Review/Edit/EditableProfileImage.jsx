import { useState, useRef, useContext, useEffect } from "react";
import { Camera, Save } from "lucide-react";
import { updateStudentApi } from "../../../api/apistudents";
import { AppContext } from "../../../Context/AppContext";
import { toast } from "react-hot-toast";

export default function EditableProfileImage({ student, updateStudentField }) {
  const { token } = useContext(AppContext);

  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  // ===============================
  // INIT PREVIEW
  // ===============================
  useEffect(() => {
    if (student?.student_image) {
      setPreview(`/storage/${student.student_image}`);
    }
  }, [student]);

  // ===============================
  // FILE CHANGE
  // ===============================
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Le fichier doit être une image.");
      return;
    }

    // nettoyer ancien preview (important)
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl = URL.createObjectURL(selected);

    setFile(selected);
    setPreview(previewUrl);
    setEditing(true);
    setError("");
  };

  // ===============================
  // SAVE
  // ===============================
  const handleSave = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const response = await updateStudentApi(
        student.id,
        { student_image: file }
      );

      // 🔥 update global + toast
      updateStudentField(response, "Photo mise à jour 📸");

      setEditing(false);
      setFile(null);
      setError("");

    } catch (err) {
      console.error(err);

      if (err.errors) {
        const errorMessages = Object.values(err.errors).flat().join(", ");
        toast.error(errorMessages || "Erreur lors du téléversement ❌", {
          position: "top-right",
        });
        setError(errorMessages || "Erreur lors du téléversement.");
      } else {
        toast.error("Erreur lors du téléversement ❌", {
          position: "top-right",
        });
        setError("Erreur lors du téléversement.");
      }

    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // CANCEL
  // ===============================
  const handleCancel = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setEditing(false);
    setFile(null);
    setPreview(`/storage/${student.student_image}`);
  };

  return (
    <div className="flex flex-col items-center">

      {/* IMAGE */}
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

      {/* ACTIONS */}
      {editing && (
        <div className="mt-3 flex gap-3">

          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-3 py-1 bg-gray-600 text-white rounded disabled:bg-gray-400"
          >
            Annuler
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-3 py-1 bg-red-600 text-white rounded disabled:bg-gray-400"
          >
            <Save className="w-4 h-4 inline mr-1" />
            {loading ? "..." : "Sauvegarder"}
          </button>

        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="mt-2 text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
}
