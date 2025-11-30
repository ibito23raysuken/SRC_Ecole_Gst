// Section.jsx
import React from "react";

export default function Section({ title, children }) {
    return (
        <div className="border rounded-xl overflow-hidden border-red-200 mb-6">
            <div className="px-4 py-3 font-bold text-lg bg-red-50 text-red-700">
                {title}
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
}
