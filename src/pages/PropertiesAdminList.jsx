// src/pages/PropertiesAdminList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteProperty, fetchProperties } from "../api";

export default function PropertiesAdminList() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    const data = await fetchProperties();
    console.log("API data:", data);
    setProperties(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch =
        !search ||
        (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.locality || "").toLowerCase().includes(search.toLowerCase());
      const matchesType =
        typeFilter === "All" || (p.property_type || "") === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [properties, search, typeFilter]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this property?")) return;
    await deleteProperty(id);
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Properties</h1>
          <p className="text-xs text-white/60">
            Manage all your property listings from one place.
          </p>
        </div>
        <button
          onClick={() => navigate("/properties/new")}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-yellow-400 text-black text-sm font-semibold hover:bg-yellow-300"
        >
          + Add Property
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <input
          placeholder="Search by title or locality…"
          className="flex-1 px-3 py-2 text-sm rounded-xl bg-[#020617] border border-white/10 outline-none focus:border-yellow-400/70"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="w-full md:w-40 px-3 py-2 text-sm rounded-xl bg-[#020617] border border-white/10 outline-none focus:border-yellow-400/70"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option>All</option>
          <option>Flat</option>
          <option>Independent House</option>
          <option>Plot</option>
          <option>Farm Land</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#020617] overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left py-2.5 px-3">ID</th>
              <th className="text-left py-2.5 px-3">Title</th>
              <th className="text-left py-2.5 px-3">Locality</th>
              <th className="text-left py-2.5 px-3">Type</th>
              <th className="text-right py-2.5 px-3">Price (L)</th>
              <th className="text-right py-2.5 px-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="py-6 px-3 text-center text-white/60"
                >
                  Loading…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-6 px-3 text-center text-white/60"
                >
                  No properties found.
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-white/5 hover:bg-white/5"
                >
                  <td className="py-2.5 px-3">{p.id}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-[11px] text-white/50">
                      {p.facing || ""} {p.rooms ? `• ${p.rooms}` : ""}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">{p.locality}</td>
                  <td className="py-2.5 px-3">{p.property_type}</td>
                  <td className="py-2.5 px-3 text-right">
                    {p.priceLakh ?? p.price_lakh ?? "--"}
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/properties/${p.id}/edit`)
                      }
                      className="text-[11px] text-blue-300 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-[11px] text-red-300 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
