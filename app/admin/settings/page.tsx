'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Settings } from '@/types';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { Save, CheckCircle, AlertTriangle } from 'lucide-react';

const empty: Partial<Settings> = {
  studioName: 'Zaref Studio',
  logo: '', email: '', phone: '', whatsapp: '',
  address: '', instagram: '', facebook: '', linkedin: '', youtube: '',
  seoTitle: 'Zaref Studio — Creative & Digital Marketing',
  seoDescription: '',
  ogImage: '', ctaText: '', whatsappCta: '',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<Settings>>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getDoc(doc(db, 'settings', 'main')).then(snap => {
      if (snap.exists()) setSettings({ id: snap.id, ...snap.data() } as Settings);
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { ...settings, updatedAt: serverTimestamp() };
      delete (data as any).id;
      await setDoc(doc(db, 'settings', 'main'), data, { merge: true });
      showToast('success', 'Settings saved!');
    } catch (err: any) {
      showToast('error', 'Save failed: ' + err.message);
    } finally { setSaving(false); }
  };

  const Field = ({
    label, name, type = 'text', placeholder, hint,
  }: {
    label: string; name: keyof Settings; type?: string; placeholder?: string; hint?: string;
  }) => (
    <div>
      <label className="block text-xs text-white/40 mb-1.5 font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={(settings as any)[name] || ''}
        onChange={handleChange}
        placeholder={placeholder}
        className="input-dark text-sm py-2.5"
        id={`settings-${name}`}
      />
      {hint && <p className="text-[11px] text-white/20 mt-1">{hint}</p>}
    </div>
  );

  if (loading) {
    return (
      <>
        <AdminTopBar title="Settings" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminTopBar title="Settings" />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-white">Site Settings</h2>
            <p className="text-xs text-white/30">Manage studio info, social links, and SEO</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-orange text-sm py-2 px-4 disabled:opacity-60"
            id="settings-save-btn"
          >
            {saving
              ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
              : <><Save size={14} />Save Settings</>
            }
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Studio Info */}
          <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Studio Information</h3>
            <Field label="Studio Name" name="studioName" placeholder="Zaref Studio" />
            <Field label="Logo URL" name="logo" placeholder="https://..." hint="Full URL to your logo image" />
            <Field label="Email" name="email" type="email" placeholder="studio@zaref.in" />
            <Field label="Phone" name="phone" placeholder="+91 XXXXX XXXXX" />
            <Field label="WhatsApp Number" name="whatsapp" placeholder="+91XXXXXXXXXX" hint="Include country code, no spaces" />
            <div>
              <label className="block text-xs text-white/40 mb-1.5 font-medium">Address</label>
              <textarea
                name="address"
                value={settings.address || ''}
                onChange={handleChange}
                placeholder="Studio address"
                rows={2}
                className="input-dark text-sm resize-none"
                id="settings-address"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Social Media</h3>
            <Field label="Instagram URL" name="instagram" placeholder="https://instagram.com/zarefstudio" />
            <Field label="Facebook URL" name="facebook" placeholder="https://facebook.com/zaref" />
            <Field label="LinkedIn URL" name="linkedin" placeholder="https://linkedin.com/company/zaref-technology" />
            <Field label="YouTube URL" name="youtube" placeholder="https://youtube.com/@zaref-technology" />
          </div>

          {/* SEO */}
          <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">SEO & Metadata</h3>
            <Field label="SEO Title" name="seoTitle" placeholder="Zaref Studio — Creative & Digital Marketing" hint="Max 60 characters" />
            <div>
              <label className="block text-xs text-white/40 mb-1.5 font-medium">SEO Description</label>
              <textarea
                name="seoDescription"
                value={settings.seoDescription || ''}
                onChange={handleChange}
                placeholder="Describe Zaref Studio for search engines..."
                rows={3}
                className="input-dark text-sm resize-none"
                id="settings-seo-desc"
              />
              <p className="text-[11px] text-white/20 mt-1">Max 160 characters · {(settings.seoDescription || '').length}/160</p>
            </div>
            <Field label="OG Image URL" name="ogImage" placeholder="https://... (1200×630px)" hint="Social share preview image" />
          </div>

          {/* CTA */}
          <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">CTA Text</h3>
            <Field label="Primary CTA Button Text" name="ctaText" placeholder="Start a Project" />
            <Field label="WhatsApp CTA Text" name="whatsappCta" placeholder="Chat on WhatsApp" />
          </div>
        </div>

        {toast && (
          <div className={`toast flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${toast.type === 'success' ? 'bg-green-500/15 border border-green-500/30 text-green-400' : 'bg-red-500/15 border border-red-500/30 text-red-400'}`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            {toast.message}
          </div>
        )}
      </main>
    </>
  );
}
