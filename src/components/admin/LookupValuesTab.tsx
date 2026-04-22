"use client";
import { useEffect, useReducer, useState } from "react";
import EntityModal from "./EntityModal";
import { toast } from "sonner";
import { useAuthGuard } from '@/hooks/useAuthGuard';

const API = "http://localhost:8080";

const CATEGORY_FIELDS = [
  { name: "code", label: "Code", required: true },
  { name: "label", label: "Label", required: true },
  { name: "description", label: "Description", required: true },
];

const VALUE_FIELDS = [
  { name: "code", label: "Code", required: true },
  { name: "displayValue", label: "Value", required: true },
  { name: "active", label: "Status", required: true,  type: "select", options:["true", "false"] },
];

// ── Reusable table section component ──────────────
function DataTable({ columns, rows, selected, onRowClick, search, onSearch, onAdd, addLabel, loading, deleteConfirm, onEdit, onDeleteRequest, onDeleteConfirm, onDeleteCancel }: any) {
  return (
    <div className="w-1/2">
      <div className="flex justify-between items-center mb-4">
        <input
          placeholder={`Search...`}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 w-48 focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <button
          onClick={onAdd}
          disabled={!onAdd}
          className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {addLabel}
        </button>
      </div>

      {loading ? (
        <div className="p-4 text-gray-500">Loading...</div>
      ) : (        
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col: string) => (
                  <th key={col} className="text-left px-4 py-3 text-m text-black font-bold uppercase">{col}</th>
                ))}
                <th className="text-left px-4 py-3 text-m font-bold text-black uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400">No data found</td></tr>
              ) : rows.map((row: any) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={`border-t border-gray-100 ${onRowClick ? "cursor-pointer hover:bg-blue-50/50" : "hover:bg-gray-50/50"} ${selected?.id === row.id ? "bg-blue-50 border-l-2 border-l-blue-500" : ""}`}
                >
                  {columns.map((col: string) => (
                    <td key={col} className="px-4 py-3 text-gray-700">{row[col] || "—"}</td>
                  ))}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(row)} className="px-3 py-1 text-xs rounded-md bg-amber-200 hover:bg-amber-300">Edit</button>
                      {deleteConfirm === row.id ? (
                        <>
                          <button onClick={() => onDeleteConfirm(row.id)} className="px-3 py-1 text-xs rounded-md text-red-600 hover:bg-green-600 hover:text-white">Confirm</button>
                          <button onClick={onDeleteCancel} className="px-3 py-1 text-xs border rounded-md text-gray-500">Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => onDeleteRequest(row.id)} className="px-3 py-1 text-xs rounded-md bg-red-500 hover:bg-red-200 text-white">Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────
export default function LookupValuesTab() {
  const { isAuth, token } = useAuthGuard();

  const [categories, setCategories] = useState<any[]>([]);
  const [values, setValues] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<any | null>(null);

  const [catSearch, setCatSearch] = useState("");
  const [valSearch, setValSearch] = useState("");

  const [catLoading, setCatLoading] = useState(true);
  const [valLoading, setValLoading] = useState(false);

  // Modal state — one object covers both panels
  const [modal, setModal] = useState<{ type: "cat" | "val"; mode: "add" | "edit"; data?: any } | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const [catDeleteConfirm, setCatDeleteConfirm] = useState<string | null>(null);
  const [valDeleteConfirm, setValDeleteConfirm] = useState<string | null>(null);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  // =========================
  // FETCH
  // =========================
  useEffect(() => {
    if (isAuth && token) fetchCategories();
  }, [isAuth, token]);

  const fetchCategories = async () => {
    setCatLoading(true);
    try {
      const res = await fetch(`${API}/admin/all_categories`, { headers });
      if (!res.ok) throw new Error(await res.text());
      setCategories(await res.json());
    } catch (err: any) {
      toast.error("Failed to load categories: " + err.message);
    } finally {
      setCatLoading(false);
    }
  };

  const fetchValues = async (categoryId: string) => {
    setValLoading(true);
    try {
      const res = await fetch(`${API}/admin/all_values/${categoryId}`, { headers });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setValues(data);
      console.log(data);
    } catch (err: any) {
      const parsed = JSON.parse(err.message);
      toast.error("Failed to load values: " + parsed.msg);
      console.log(err.message);
    } finally {
      setValLoading(false);
    }
  };

  // =========================
  // MODAL HELPERS
  // =========================
  const openAdd = (type: "cat" | "val") => { setForm({}); setModal({ type, mode: "add" }); };
  const openEdit = (type: "cat" | "val", data: any) => { setForm(data); setModal({ type, mode: "edit", data }); };
  const closeModal = () => { setModal(null); setForm({}); };

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {
    if (!modal) return;
    const isCat = modal.type === "cat";
    const isEdit = modal.mode === "edit";

    const url = isCat
      ? isEdit ? `${API}/admin/update_category/${modal.data?.id}` : `${API}/admin/create_category`
      : isEdit ? `${API}/admin/update_value/${modal.data?.id}` : `${API}/admin/create_value`;

    const body = isCat ? form : { ...form, categoryId: selectedCat?.id };

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      toast.success(data.msg);
      isCat ? fetchCategories() : fetchValues(selectedCat?.id);
      closeModal();
    } catch (err) {
      toast.error("Save failed: " + err);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (type: "cat" | "val", id: string) => {
    console.log(id);
    const url = type === "cat"
      ? `${API}/admin/delete_category/${id}`
      : `${API}/admin/delete_value/${id}`;
    try {
      const res = await fetch(url, { method: "DELETE", headers });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Deleted successfully");
      if (type === "cat") {
        if (selectedCat?.id === id) { setSelectedCat(null); setValues([]); }
        fetchCategories();
        setCatDeleteConfirm(null);
      } else {
        fetchValues(selectedCat?.id);
        setValDeleteConfirm(null);
      }
    } catch (err) {
      toast.error("Delete failed: " + err);
    }
  };

  // =========================
  // FILTERED ROWS
  // =========================
  const filteredCats = categories.filter((c) =>
    c.code?.toLowerCase().includes(catSearch.toLowerCase())
  );
  const filteredVals = values.filter((v) =>
    (v.code || "").toLowerCase().includes(valSearch.toLowerCase())
  );

  return (
    <div className="flex gap-6">

      {/* CATEGORIES */}
      <DataTable
        columns={["code", "label", "description"]}
        rows={filteredCats}
        selected={selectedCat}
        onRowClick={(cat: any) => { setSelectedCat(cat); setValues([]); setValSearch(""); fetchValues(cat.id); }}
        search={catSearch}
        onSearch={setCatSearch}
        onAdd={() => openAdd("cat")}
        addLabel="+ Add Category"
        loading={catLoading}
        deleteConfirm={catDeleteConfirm}
        onEdit={(row: any) => openEdit("cat", { code: row.code, label: row.label, description: row.description, id: row.id })}
        onDeleteRequest={setCatDeleteConfirm}
        onDeleteConfirm={(id: string) => handleDelete("cat", id)}
        onDeleteCancel={() => setCatDeleteConfirm(null)}
      />

      {/* LOOKUP VALUES */}
      {!selectedCat ? (
        <div className="w-1/2 flex items-center justify-center h-48 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm mt-14">
          ← Select a category to view its values
        </div>
      ) : (
        <DataTable
          columns={["code", "displayValue", "active"]}
          rows={filteredVals}
          selected={null}
          search={valSearch}
          onSearch={setValSearch}
          onAdd={() => openAdd("val")}
          addLabel="+ Add Value"
          loading={valLoading}
          deleteConfirm={valDeleteConfirm}
          onEdit={(row: any) => openEdit("val", { code: row.code, displayValue: row.displayValue, active: row.active, id: row.id })}
          onDeleteRequest={setValDeleteConfirm}
          onDeleteConfirm={(id: string) => handleDelete("val", id)}
          onDeleteCancel={() => setValDeleteConfirm(null)}
        />
      )}

      {/* SINGLE MODAL for both */}
      {modal && (
        <EntityModal
          title={modal.type === "cat" ? "category" : "lookup value"}
          fields={modal.type === "cat" ? CATEGORY_FIELDS : VALUE_FIELDS}
          values={form}
          onChange={(name: string, val: string) => setForm((prev) => ({ ...prev, [name]: val }))}
          onSave={handleSave}
          onClose={closeModal}
          isEdit={modal.mode === "edit"}
        />
      )}
    </div>
  );
}