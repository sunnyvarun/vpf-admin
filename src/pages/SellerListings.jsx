import { useEffect, useState } from "react";
import { fetchSellerListings } from "../api";
import { useNavigate } from "react-router-dom";

export default function SellerListings() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSellerListings().then(setData);
  }, []);

  return (
    <div className="max-w-5xl">
      <h1 className="text-xl font-semibold mb-4">
        Seller Submitted Properties
      </h1>

      <div className="overflow-x-auto border border-white/10 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[#020617] text-white/60">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Property Type</th>
              <th className="p-3 text-left">Locality</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Action</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="p-3">{item.owner_name}</td>
                <td className="p-3">{item.property_type}</td>
                <td className="p-3">{item.locality}</td>
                <td className="p-3">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => navigate(`/seller/${item.id}`)}
                    className="px-3 py-1 rounded bg-yellow-400 text-black text-xs"
                  >
                    View
                  </button>
                </td>
                <td className="p-3">
  {item.status === "approved" ? (
    <span className="text-green-400">Approved</span>
  ) : (
    <span className="text-yellow-400">Pending</span>
  )}
</td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-white/50">
                  No submissions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}