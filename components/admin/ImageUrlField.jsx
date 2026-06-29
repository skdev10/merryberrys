'use client';

import { useRef, useState } from 'react';
import { Upload, Link2, Loader2 } from 'lucide-react';
import { adminFetch } from '@/lib/adminClient';

export default function ImageUrlField({
  label,
  hint,
  value,
  onChange,
  placeholder = 'https://… ya image upload karein',
  previewClass = 'h-32 w-full max-w-md',
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await adminFetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.message || 'Upload failed');
        return;
      }
      onChange(data.url);
    } catch {
      setUploadError('Upload failed. Image URL paste kar sakte ho.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-zinc-200 block">{label}</label>
      )}
      {hint && <p className="text-xs text-zinc-500 leading-relaxed">{hint}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-berry-600/80 text-white text-sm hover:bg-berry-600 disabled:opacity-50"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? 'Uploading…' : 'Upload image'}
        </button>
        <a
          href="https://imgbb.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-zinc-400 text-sm hover:text-white hover:bg-white/5"
        >
          <Link2 size={16} /> ImgBB (free host)
        </a>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => uploadFile(e.target.files?.[0])}
      />

      <input
        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />

      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}

      {value && (
        <div className="rounded-xl border border-white/10 overflow-hidden bg-zinc-900/40 p-2">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Preview</p>
          <img
            src={value}
            alt=""
            className={`${previewClass} rounded-lg object-cover bg-zinc-800`}
            onError={(e) => {
              e.currentTarget.style.opacity = '0.3';
            }}
          />
        </div>
      )}
    </div>
  );
}
