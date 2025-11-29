// vpf-admin/src/pages/PropertyTypesPage.jsx
import { useEffect, useState } from "react";
import { fetchPropertyTypes, savePropertyType, deletePropertyType } from "../api";

export default function PropertyTypesPage() {
  const [types, setTypes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setTypes(await fetchPropertyTypes());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function newType() {
    setEditing({ id: null, name: "", slug: "", position: 0 });
  }
  function edit(t) { setEditing({ ...t }); }
  function cancel() { setEditing(null); }

  async function save() {
    const res = await savePropertyType(editing);
    if (!res.success) return alert(res.error || "Error");
    await load();
    setEditing(null);
  }

  async function remove(id) {
    if (!confirm("Delete this type?")) return;
    const res = await deletePropertyType(id);
    if (!res.success) return alert(res.error || "Error");
    await load();
  }

  if (loading) return <div>Loading types…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Property Types</h1>
        <button onClick={newType} className="px-3 py-2 rounded bg-yellow-400 text-black">+ Add</button>
      </div>

      {editing ? (
        <div className="bg-[#020617] p-4 rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} placeholder="Name" className="p-2 rounded bg-[#0C1330]" />
            <input value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})} placeholder="Slug" className="p-2 rounded bg-[#0C1330]" />
            <input value={editing.position} onChange={e => setEditing({...editing, position: Number(e.target.value)})} placeholder="Position" className="p-2 rounded bg-[#0C1330]" />
          </div>
          <div className="mt-3">
            <button onClick={save} className="px-3 py-2 rounded bg-green-500 mr-2">Save</button>
            <button onClick={cancel} className="px-3 py-2 rounded bg-gray-600">Cancel</button>
          </div>
        </div>
      ) : null }

      <div className="bg-[#020617] rounded p-4">
        <table className="w-full text-sm">
          <thead><tr><th>Name</th><th>Slug</th><th>Position</th><th></th></tr></thead>
          <tbody>
            {types.map(t => (
              <tr key={t.id} className="border-t border-white/5">
                <td className="py-2">{t.name}</td>
                <td className="py-2">{t.slug}</td>
                <td className="py-2">{t.position}</td>
                <td className="py-2 text-right space-x-2">
                  <button onClick={() => edit(t)} className="text-xs text-blue-300">Edit</button>
                  <button onClick={() => remove(t.id)} className="text-xs text-red-300">Delete</button>
                </td>
              </tr>
            ))}
            {types.length === 0 && <tr><td colSpan={4} className="py-4 text-center">No types yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
