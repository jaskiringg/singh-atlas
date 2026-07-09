import { Lightbox } from "./lightbox";

/**
 * Screenshot frame. Drop a real image in `src` (under /public) and it fills the frame.
 * Until then it shows a labelled blueprint placeholder so the layout reads as intentional.
 * When a real src is present, the frame is clickable and opens a lightbox.
 */
export function Frame({
  url,
  label,
  src,
  bare = false,
}: {
  url?: string;
  label: string;
  src?: string;
  bare?: boolean;
}) {
  return (
    <div className="frame">
      {!bare && (
        <div className="frame-bar">
          <i /><i /><i />
          {url && <span className="url">{url}</span>}
        </div>
      )}
      <div className="frame-canvas">
        {src ? (
          <Lightbox src={src} label={label} />
        ) : (
          <div className="frame-ph">
            <b>{label}</b>
            screenshot drops in here
          </div>
        )}
      </div>
    </div>
  );
}
