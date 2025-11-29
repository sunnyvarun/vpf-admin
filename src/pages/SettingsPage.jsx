// vpf-admin/src/pages/SettingsPage.jsx
import { useEffect, useState } from "react";
import { fetchSettings, saveSettings } from "../api";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_title: "",
    hero_title: "",
    hero_subtitle: "",
    phone_number: "",
    whatsapp_number: "",
    footer_text: "",
    featured_label: "",
    contact_email: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchSettings();
      setSettings(prev => ({ ...prev, ...data }));
      setLoading(false);
    })();
  }, []);

  function handleChange(e) {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    const email = settings.contact_email?.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return alert("Please enter a valid email address");
  }
    setSaving(true);
    const res = await saveSettings(settings);
    setSaving(false);
    if (!res.success) alert(res.error || "Failed to save");
    else alert("Saved");
  }

  if (loading) return <div>Loading settings…</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Site Settings</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <Field label="Site Title" name="site_title" value={settings.site_title} onChange={handleChange} />
        <Field label="Hero Title" name="hero_title" value={settings.hero_title} onChange={handleChange} />
        <Field label="Hero Subtitle" name="hero_subtitle" value={settings.hero_subtitle} onChange={handleChange} />
        <Field label="Contact Email" name="contact_email" value={settings.contact_email} onChange={handleChange} />
        <Field label="Phone Number" name="phone_number" value={settings.phone_number} onChange={handleChange} />
        <Field label="WhatsApp Number" name="whatsapp_number" value={settings.whatsapp_number} onChange={handleChange} />
        <Field label="Featured Label" name="featured_label" value={settings.featured_label} onChange={handleChange} />
        <Field label="Footer Text" name="footer_text" value={settings.footer_text} onChange={handleChange} />
        <div className="pt-4">
          <button disabled={saving} className="px-4 py-2 rounded bg-yellow-400 text-black font-semibold">
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-white/70 mb-1">{label}</label>
      <input name={name} value={value} onChange={onChange} className="w-full px-3 py-2 rounded bg-[#020617] border border-white/10" />
    </div>
  );
}
