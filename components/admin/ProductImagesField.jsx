'use client';

import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import ImageUrlField from './ImageUrlField';

export default function ProductImagesField({ images, onChange, compact = false }) {
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

  const moveAt = (index, direction) => {
    const next = list.filter(Boolean);
    const url = list[index];
    if (!url) return;
    const filledIndex = next.indexOf(url);
    const target = filledIndex + direction;
    if (target < 0 || target >= next.length) return;
    [next[filledIndex], next[target]] = [next[target], next[filledIndex]];
    onChange(next);
  };

  const filled = list.filter(Boolean);

  const filledIndexOf = (index) => {
    const url = list[index];
    if (!url) return -1;
    return filled.indexOf(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-zinc-200">Product photos</p>
        <p className="text-xs text-zinc-500 mt-1">
          Upload karein ya URL paste karein. Pehli = main photo, doosri = hover. Order change karne ke liye ↑↓ use karein.
        </p>
      </div>
      {list.map((url, index) => (
        <div key={index} className="border border-white/5 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs uppercase tracking-wider text-zinc-500">
              Photo {index + 1}{index === 0 ? ' (main)' : index === 1 ? ' (hover)' : ''}
            </span>
            <div className="flex items-center gap-1">
              {filled.length > 1 && url && (
                <>
                  <button
                    type="button"
                    onClick={() => moveAt(index, -1)}
                    disabled={filledIndexOf(index) <= 0}
                    className="p-1 text-zinc-500 hover:text-white disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveAt(index, 1)}
                    disabled={filledIndexOf(index) < 0 || filledIndexOf(index) >= filled.length - 1}
                    className="p-1 text-zinc-500 hover:text-white disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                </>
              )}
              {list.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="text-red-400 hover:text-red-300 p-1"
                  aria-label="Remove slot"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
          <ImageUrlField
            value={url}
            onChange={(v) => updateAt(index, v)}
            previewClass={compact ? 'h-20 w-20' : 'h-24 w-24'}
            saveHint="✓ Photo set — product Save karein"
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
