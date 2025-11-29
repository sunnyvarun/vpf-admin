import { useEffect, useState } from "react";
import { fetchFeatured, fetchProperties, saveFeatured, deleteFeatured } from "../api";

export default function FeaturedAdmin() {
  const [featured, setFeatured] = useState([]);
  const [properties, setProperties] = useState([]);
  const [editing, setEditing] = useState(null);
  async function load() {
    setFeatured(await fetchFeatured());
    setProperties(await fetchProperties());
  }
  useEffect(() => { load(); }, []);

  function newItem(){ setEditing({id:null,property_id:'',position:0,note:''}); }
  function edit(item){ setEditing({...item}); }
  async function save() {
          try {
            await saveFeatured(editing);
            setEditing(null);
            load();
          } catch (err) {
            // show backend error if available
            const msg =
              err.response?.data?.error ||
              err.response?.data?.message ||
              err.message ||
              "Failed to save";
            alert("Save failed: " + msg);
            console.error("Featured save error:", err.response?.data || err);
          }
        }
        
  async function remove(id){ if(!confirm('Delete?')) return; await deleteFeatured(id); load(); }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Featured Listings</h1>
        <button onClick={newItem} className="px-3 py-2 rounded bg-yellow-400 text-black">+ Add</button>
      </div>

      {editing && (
        <div className="bg-[#020617] p-4 rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select value={editing.property_id} onChange={e=>setEditing({...editing,property_id:e.target.value})} className="p-2 rounded bg-[#0C1330]">
              <option value="">Select property</option>
              {properties.map(p=> <option key={p.id} value={p.id}>{p.title} — {p.locality}</option>)}
            </select>
            <input type="number" value={editing.position} onChange={e=>setEditing({...editing,position:Number(e.target.value)})} className="p-2 rounded bg-[#0C1330]" />
            <input value={editing.note||''} onChange={e=>setEditing({...editing,note:e.target.value})} placeholder="Note (optional)" className="p-2 rounded bg-[#0C1330]" />
          </div>
          <div className="mt-3">
            <button onClick={save} className="px-3 py-2 rounded bg-green-500 mr-2">Save</button>
            <button onClick={()=>setEditing(null)} className="px-3 py-2 rounded bg-gray-600">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-[#020617] rounded p-4">
        <table className="w-full text-sm">
          <thead><tr><th>ID</th><th>Property</th><th>Locality</th><th>Position</th><th></th></tr></thead>
          <tbody>
            {featured.map(f => (
              <tr key={f.id} className="border-t border-white/5">
                <td className="py-2 px-2">{f.id}</td>
                <td className="py-2">{f.title}</td>
                <td className="py-2">{f.locality}</td>
                <td className="py-2">{f.position}</td>
                <td className="py-2 text-right">
                  <button onClick={()=>edit(f)} className="text-xs text-blue-300 mr-3">Edit</button>
                  <button onClick={()=>remove(f.id)} className="text-xs text-red-300">Delete</button>
                </td>
              </tr>
            ))}
            {featured.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-white/60">No featured listings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
