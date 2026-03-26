import { toast } from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";

export const showSuccessToast = (message) => {
  toast.custom((t) => (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg bg-white border border-green-200
      ${t.visible ? "animate-enter" : "animate-leave"}`}
    >
      <CheckCircle className="text-green-600 w-6 h-6" />
      <span className="text-sm font-medium text-gray-800">
        {message}
      </span>
    </div>
  ));
};

export const showErrorToast = (message) => {
  toast.custom((t) => (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg bg-white border border-red-200
      ${t.visible ? "animate-enter" : "animate-leave"}`}
    >
      <XCircle className="text-red-600 w-6 h-6" />
      <span className="text-sm font-medium text-gray-800">
        {message}
      </span>
    </div>
  ));
};
