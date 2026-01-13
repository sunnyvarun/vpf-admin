// src/pages/PropertyForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProperties,
  fetchPropertyById,
  saveProperty,
  fetchPropertyTypes,
} from "../api";

export default function PropertyForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    priceLakh: "",
    locality: "",
    nearby_locations: "",
    property_type: "",        
    property_type_slug: "",    
    property_type_id: "",      
    facing: "",
    rooms: "",
    plotSize: "",
    videoUrl: "",
    description: "",
    availability: "",
    status: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [types, setTypes] = useState([]);

useEffect(() => {
  // load types once
  fetchPropertyTypes().then(setTypes);
}, []);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const data = await fetchPropertyById(id);
        if (data.error) {
          alert("Property not found");
          navigate("/properties");
          return;
        }
        setForm({
          title: data.title || "",
          priceLakh: data.priceLakh || data.price_lakh || "",
          locality: data.locality || "",
          nearby_locations: data.nearby_locations || "",
          property_type: data.property_type || data.property_type_name || "",
          property_type_slug: data.property_type_slug || "",
          property_type_id: data.property_type_id || "",
          facing: data.facing || "",
          rooms: data.rooms || "",
          plotSize: data.plotSize || data.plot_size || "",
          videoUrl: data.videoUrl || data.video_url || "",
          description: data.description || "",
          availability: data.availability || "",
          status: data.status || "",
        });
        if (data.image || data.image_url) {
          setImagePreview(data.image || data.image_url);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, id, navigate]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleTypeChange(e) {
    const slugOrId = e.target.value;
    // if option values are slug (string), find matching type
    const selected = types.find(t => String(t.slug) === String(slugOrId) || String(t.id) === String(slugOrId));
    if (selected) {
      setForm(prev => ({ 
        ...prev, 
        property_type_slug: selected.slug, 
        property_type_id: selected.id,
        property_type: selected.name
      }));
    } else {
      // fallback: slug selected may be "": clear
      setForm(prev => ({ ...prev, property_type_slug: slugOrId, property_type_id: "", property_type: slugOrId }));
    }
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData();
    if (isEdit) fd.append("id", id);
    fd.append("title", form.title);
    fd.append("price_lakh", form.priceLakh);
    fd.append("locality", form.locality);
    fd.append("nearby_locations", form.nearby_locations);
    fd.append("property_type", form.property_type);
    fd.append("property_type_slug", form.property_type_slug);
    fd.append("property_type_id", form.property_type_id || "");
    fd.append("facing", form.facing);
    fd.append("rooms", form.rooms);
    fd.append("plot_size", form.plotSize);
    fd.append("video_url", form.videoUrl);
    fd.append("description", form.description);
    fd.append("availability", form.availability);
    fd.append("status", form.status);

    if (imageFile) fd.append("image", imageFile);

    const res = await saveProperty(fd);
    setSaving(false);
    if (res.success) {
      navigate("/properties");
    } else {
      alert(res.error || "Failed to save property");
    }
  }

  if (loading) {
    return <div className="text-sm text-white/60">Loading property…</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">
            {isEdit ? "Edit Property" : "Create Property"}
          </h1>
          <p className="text-xs text-white/60">
            Fill the details carefully. This is what shows on public site.
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left 2 columns – form fields */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title" name="title" value={form.title} onChange={handleChange} required />
            <Field
              label="Price (Lakh)"
              name="priceLakh"
              type="number"
              value={form.priceLakh}
              onChange={handleChange}
              required
            />
            <Field
              label="Locality"
              name="locality"
              value={form.locality}
              onChange={handleChange}
              required
            />
            <Field
  label="Nearby Locations (comma separated)"
  name="nearby_locations"
  value={form.nearby_locations}
  onChange={handleChange}
  placeholder="Metro, Airport, ORR, Mall"
/>

            
            <div>
              <Label>Property Type</Label>
              <select
                name="property_type_slug"
                value={form.property_type_slug || ""}
                onChange={handleTypeChange}
                className="w-full px-3 py-2 text-sm rounded-xl bg-[#020617] border border-white/10 outline-none"
              >
                <option value="">Select a type</option>
                {types.map(t => (
                  <option key={t.id} value={t.slug}>{t.name}</option>
                ))}
              </select>

            </div>
            <Field
              label="Facing"
              name="facing"
              value={form.facing}
              onChange={handleChange}
            />
            <Field
              label="Rooms (e.g. 2BHK)"
              name="rooms"
              value={form.rooms}
              onChange={handleChange}
            />
            <Field
              label="Plot Size (e.g. 1250 sq.ft)"
              name="plotSize"
              value={form.plotSize}
              onChange={handleChange}
            />
            <Field
              label="YouTube Video URL"
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
            />
            <Field
  label="Availability (e.g. Ready to Move, Under Construction)"
  name="availability"
  value={form.availability}
  onChange={handleChange}
/>
<Field
  label="Status (e.g. Premium,Classic,Normal)"
  name="status"
  value={form.status}
  onChange={handleChange}
/>

          </div>

          <div>
            <Label>Description</Label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-xl bg-[#020617] border border-white/10 outline-none focus:border-yellow-400/70"
            />
          </div>
        </div>

        {/* Right column – image */}
        <div className="space-y-4">
          <div className="bg-[#020617] border border-white/10 rounded-2xl p-4">
            <Label>Cover Image</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 text-xs"
            />
            {imagePreview && (
              <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
            <p className="mt-2 text-[11px] text-white/50">
              Recommended: landscape image, >= 1200px wide. If you don’t upload
              a new image while editing, the existing one is kept.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-yellow-400 text-black text-sm font-semibold hover:bg-yellow-300 disabled:opacity-60"
          >
            {saving
              ? isEdit
                ? "Saving changes…"
                : "Creating property…"
              : isEdit
              ? "Save Changes"
              : "Create Property"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Label({ children }) {
  return (
    <label className="block text-[11px] font-medium text-white/60 mb-1.5">
      {children}
    </label>
  );
}

function Field({ label, name, value, onChange, type = "text", required }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        value={value}
        required={required}
        onChange={onChange}
        className="w-full px-3 py-2 text-sm rounded-xl bg-[#020617] border border-white/10 outline-none focus:border-yellow-400/70"
      />
    </div>
  );
}
