"use client";
import { useContext, useEffect, useState } from "react";
import EntityModal from "./EntityModal";
import { toast } from "sonner";
import { useAuthGuard } from '@/hooks/useAuthGuard';

const API = "http://localhost:8080";

const FIELDS = [
  { name: "name", label: "Role name", required: true },
  { name: "description", label: "Description", required: false },
];

export default function PositionsTabs() {
  const {isAuth,token} = useAuthGuard();

  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // =========================
  // FETCH ROLES
  // =========================
  useEffect(() => {
    if (!isAuth || !token) {
      setLoading(false);
      return;
    }
    fetchRoles();
  }, [isAuth, token]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API}/admin/allRoles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text}`);
      }

      const data = await res.json();
      const parsed = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description ?? ""
      }));
      setRoles(parsed);

    } catch (err: any) {
      toast.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // OPEN MODALS
  // =========================
  const openAdd = () => {
    setForm({});
    setSelected(null);
    setModal("add");
  };

  const openEdit = (role: any) => {
    setSelected(role);
    setForm({
      name: role.name,
      description: role.description,
    });
    setModal("edit");
  };

  // =========================
  // SAVE (CREATE / UPDATE)
  // =========================
  const handleSave = async () => {
    if (!form.name) return;

    try {
      if (modal === "add") {
        const formdata = {
          ...form,
          updatedBy: localStorage.getItem("userID"),
        }
        const res = await fetch(`${API}/admin/create_roles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formdata),
        });

        const newRole = await res.json();
        setRoles((prev) => [...prev, newRole]);
      }

      if (modal === "edit" && selected) {
        const formdata = {
          ...form,
          updatedBy: localStorage.getItem("userID"),
        }
        console.log(localStorage.getItem("userID"));
        const res = await fetch(`${API}/admin/update_Roles/${selected.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formdata),
        });        
      }

      await fetchRoles();
      setModal(null);
      setSelected(null);
      setForm({});
    } catch (err) {
      toast.error("Save error:" + err);
    }
  };

  // =========================
  // DELETE ROLE
  // =========================
const handleDelete = async (id: string) => {
  try {
    const res = await fetch(`${API}/admin/delete_Roles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to delete role");
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    toast.success(data.msg); 
    await fetchRoles();
    setDeleteConfirm(null);
  } catch (err) {
    toast.error("Delete error: " + err);
  }
};

  // =========================
  // FILTERED DATA
  // =========================
  const filtered = roles.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // RENDER STATES
  // =========================
  if (loading) {
    return <div className="p-4 text-gray-500">Loading roles...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 flex items-center gap-2">
        <span>⚠ {error}</span>
        <button
          onClick={fetchRoles}
          className="ml-2 px-3 py-1 text-xs border border-red-300 rounded-md text-red-500 hover:bg-red-50"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search roles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 w-56 focus:outline-none focus:ring-1 focus:ring-gray-400"
        />

        <button
          onClick={openAdd}
          className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          + Add role
        </button>
      </div>

      {/* TABLE */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  No roles found
                </td>
              </tr>
            ) : (
              filtered.map((role) => (
                <tr
                  key={role.id}
                  className="border-t border-gray-100 hover:bg-gray-50/50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {role.name}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {role.description || "—"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(role)}
                        className="px-3 py-1 text-m  rounded-md hover:bg-gray-50 text-black bg-amber-200"
                      >
                        Edit
                      </button>

                      {deleteConfirm === role.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="px-3 py-1 text-m  border-red-900 rounded-md text-red-600 hover:bg-green-600 hover:text-amber-50 "
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 text-xs border rounded-md text-gray-500 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(role.id)}
                          className="px-3 py-1 text-m border border-red-100 rounded-md bg-red-500 hover:bg-red-200 hover:text-black text-amber-50"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modal && (
        <EntityModal
          title="role"
          fields={FIELDS}
          values={form}
          onChange={(name, val) =>
            setForm((prev) => ({ ...prev, [name]: val }))
          }
          onSave={handleSave}
          onClose={() => setModal(null)}
          isEdit={modal === "edit"}
        />
      )}
    </div>
  );
}