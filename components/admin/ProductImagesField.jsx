'use client';

import { Plus, Trash2 } from 'lucide-react';
import ImageUrlField from './ImageUrlField';

export default function ProductImagesField({ images, onChange }) {
  const list = images.length ? images : [''];

  const updateAt = (index, url) => {
    const next = [...list];
    next[index] = url;
    onChange(next.filter(Boolean));
  };

  const addSlot = () => onChange([...list.filter(Boolean), '']);

  const removeAt = (index) => {
    const next = list.filter((_, i) => i !== index);
    onChange(next.filter(Boolean));
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-zinc-200">Product photos</p>
        <p className="text-xs text-zinc-500 mt-1">
          Photo upload karein — website par permanently save hogi. Pehli = main, doosri = hover.
        </p>
      </div>
      {list.map((url, index) => (
        <div key={index} className="border border-white/5 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-500">
              Photo {index + 1}{index === 0 ? ' (main)' : ''}
            </span>
            {list.length > 1 && (
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="text-red-400 hover:text-red-300 p-1"
                aria-label="Remove"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <ImageUrlField
            value={url}
            onChange={(v) => updateAt(index, v)}
            previewClass="h-24 w-24"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addSlot}
        className="inline-flex items-center gap-2 text-sm text-berry-400 hover:text-berry-300"
      >
        <Plus size={16} /> Add another photo
      </button>
    </div>
  );
}
