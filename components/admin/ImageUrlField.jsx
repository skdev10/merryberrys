'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2, ImageIcon } from 'lucide-react';
import { adminFetch } from '@/lib/adminClient';

export default function ImageUrlField({
  label,
  hint,
  value,
  onChange,
  previewClass = 'h-40 w-full max-w-md',
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setUploadError('Sirf image files (JPG, PNG, WebP)');
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await adminFetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(
          res.status === 401
            ? 'Session expire — logout karke dubara login karein'
            : data.message || 'Upload failed'
        );
        return;
      }
      onChange(data.url);
    } catch {
      setUploadError('Upload failed — database connected hai check karein');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium text-zinc-200 block">{label}</label>}
      {hint && <p className="text-xs text-zinc-500 leading-relaxed">{hint}</p>}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragOver ? 'border-berry-500 bg-berry-500/10' : 'border-white/10 bg-zinc-900/30'
        }`}
      >
        {value ? (
          <div className="space-y-3">
            <img
              src={value}
              alt=""
              className={`${previewClass} mx-auto rounded-lg object-cover bg-zinc-800 border border-white/10`}
            />
            <p className="text-xs text-green-400">✓ Image set — Save page settings to apply on website</p>
          </div>
        ) : (
          <div className="py-4 text-zinc-500">
            <ImageIcon className="mx-auto mb-2 opacity-50" size={32} />
            <p className="text-sm">Photo yahan drop karein ya neeche button</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-berry-600 text-white text-sm hover:bg-berry-500 disabled:opacity-50"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? 'Upload ho rahi hai…' : value ? 'Change image' : 'Choose image'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => uploadFile(e.target.files?.[0])}
      />

      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
    </div>
  );
}
