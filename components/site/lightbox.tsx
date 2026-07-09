"use client";

import { useEffect, useState } from "react";

/**
 * Minimal click-to-expand lightbox for screenshot frames. Plain React state,
 * fixed overlay, click-outside or Escape to close. No library.
 */
export function Lightbox({ src, label }: { src: string; label: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button type="button" className="frame-zoom-btn" onClick={() => setOpen(true)} aria-label={`Expand ${label}`}>
        <img src={src} alt={label} loading="lazy" />
      </button>
      {open && (
        <div className="lightbox-overlay" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label={label}>
          <button type="button" className="lightbox-close" onClick={() => setOpen(false)} aria-label="Close">
            ✕
          </button>
          <img
            src={src}
            alt={label}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="lightbox-caption">{label}</div>
        </div>
      )}
    </>
  );
}
