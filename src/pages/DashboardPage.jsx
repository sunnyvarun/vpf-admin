// src/pages/DashboardPage.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchProperties } from "../api";

export default function DashboardPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = properties.length;
    const byType = {};
    let totalValue = 0;
    properties.forEach((p) => {
      const t = p.property_type || "Other";
      byType[t] = (byType[t] || 0) + 1;
      totalValue += Number(p.priceLakh || p.price_lakh || 0);
    });
    return { total, byType, totalValue };
  }, [properties]);

  if (loading) {
    return <div className="text-sm text-white/60">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-xs text-white/60">
          Quick overview of your property inventory.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#020617] border border-white/10 rounded-2xl p-4">
          <div className="text-xs text-white/60">Total Properties</div>
          <div className="text-2xl font-semibold mt-2">{stats.total}</div>
        </div>
        <div className="bg-[#020617] border border-white/10 rounded-2xl p-4">
          <div className="text-xs text-white/60">Total Listed Value (Lakh)</div>
          <div className="text-2xl font-semibold mt-2">
            {stats.totalValue.toFixed(1)}
          </div>
        </div>
        <div className="bg-[#020617] border border-white/10 rounded-2xl p-4">
          <div className="text-xs text-white/60">Types</div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {Object.entries(stats.byType).map(([type, count]) => (
              <span
                key={type}
                className="px-2 py-1 rounded-full bg-white/5 border border-white/10"
              >
                {type}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent properties list */}
      <div className="bg-[#020617] border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Recent Properties</h2>
          <span className="text-[11px] text-white/50">
            Showing latest {Math.min(5, properties.length)}
          </span>
        </div>
        <div className="space-y-2 text-xs">
          {properties.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between border border-white/5 rounded-xl px-3 py-2"
            >
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-white/50">
                  {p.locality} • {p.property_type}
                </div>
              </div>
              <div className="text-right text-white/70">
                ₹{(p.priceLakh || p.price_lakh) ?? "--"} L
              </div>
            </div>
          ))}
          {properties.length === 0 && (
            <div className="text-white/50">No properties yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
