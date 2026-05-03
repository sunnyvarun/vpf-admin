import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSellerListingById, approveSellerListing, deleteSellerListing } from "../api";


export default function SellerListingView() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSellerListingById(id).then(setData);
  }, [id]);

  if (!data) {
    return <div className="text-white/60">Loading...</div>;
  }

  

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-semibold">
        Seller Property Details
      </h1>

      <div className="bg-[#020617] border border-white/10 rounded-2xl p-6 space-y-4 text-sm">

        <Row label="Owner Name" value={data.owner_name} />
        <Row label="Phone" value={data.owner_phone} />
        <Row label="Property Type" value={data.property_type} />
        <Row label="Title" value={data.title} />
        <Row label="BHK" value={data.bhk} />
        <Row label="Locality" value={data.locality} />
        <Row label="Price (Lakh)" value={data.price_lakh} />
        <Row label="Submitted On" value={new Date(data.created_at).toLocaleString()} />

        <div>
          <p className="text-white/60 text-xs mb-1">Description</p>
          <p className="text-white">{data.description || "—"}</p>
        </div>

        {data.media && (
  <div>
    <p className="text-white/60 text-xs mb-2">Media</p>

    <div className="grid grid-cols-3 gap-3">
      {JSON.parse(data.media).map((url, i) => {
        const fullUrl = `https://vpf-admin.webhostdevs.com${url}`;

        const isVideo = url.match(/\.(mp4|mov|webm)$/i);

        return isVideo ? (
          <video
            key={i}
            src={fullUrl}
            controls
            className="w-full h-32 object-cover rounded-lg"
          />
        ) : (
          <img
            key={i}
            src={fullUrl}
            className="w-full h-32 object-cover rounded-lg"
          />
        );
      })}
    </div>
  </div>
)}

<div className="flex gap-3 pt-4">

  <button
    onClick={async () => {
      await approveSellerListing(data.id);
      alert("Approved");
      navigate("/seller-listings");
    }}
    className="px-4 py-2 rounded bg-green-500 text-white text-sm"
  >
    Approve
  </button>

  <button
    onClick={async () => {
      if (!confirm("Are you sure to reject/delete?")) return;
      await deleteSellerListing(data.id);
      alert("Deleted");
      navigate("/seller-listings");
    }}
    className="px-4 py-2 rounded bg-red-500 text-white text-sm"
  >
    Reject
  </button>

</div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <p className="text-white/60 text-xs mb-1">{label}</p>
      <p className="text-white">{value || "—"}</p>
    </div>
  );
}