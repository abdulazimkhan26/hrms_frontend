"use client";
import { useEffect } from "react";

interface Field {
  name: string;
  label: string;
  type?: "text" | "select" | "textarea";
  options?: string[]; // for select
  required?: boolean;
}

interface Props {
  title: string;
  fields: Field[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onSave: () => void;
  onClose: () => void;
  isEdit?: boolean;
}

export default function EntityModal({
  title, fields, values, onChange, onSave, onClose, isEdit
}: Props) {

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-sm">
        <h2 className="text-base font-medium text-gray-900 mb-1">
          {isEdit ? `Edit ${title}` : `Add new ${title}`}
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          {isEdit ? "Update the details below" : "Fill in the details to create"}
        </p>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>

              {field.type === "select" ? (
                <select
                  value={values[field.name] || ""}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={values[field.name] || ""}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={values[field.name] || ""}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            {isEdit ? "Save changes" : `Add ${title.toLowerCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
}