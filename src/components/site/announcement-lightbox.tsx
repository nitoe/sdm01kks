import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState, type TransitionEvent } from "react";
import { formatDate } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";

let shownThisVisit = false;
const READ_KEY = "sdm-pengumuman-dibaca";

function readSignature(ids: string[]) {
  return ids.slice().sort().join("|");
}

function markedRead(signature: string) {
  try {
    return window.localStorage.getItem(READ_KEY) === signature;
  } catch {
    return false;
  }
}

function storeRead(signature: string, on: boolean) {
  try {
    if (on) window.localStorage.setItem(READ_KEY, signature);
    else window.localStorage.removeItem(READ_KEY);
  } catch {
    /* mode privat: centang hanya berlaku untuk kunjungan ini */
  }
}

export function AnnouncementLightbox() {
  const source = useSiteStore((state) => state.source);
  const show = useSiteStore((state) => state.content.show.pengumuman);
  const announcements = useSiteStore((state) => state.content.announcements);
  const items = announcements.filter((item) => item.visible);
  const signature = readSignature(items.map((item) => item.id));
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [index, setIndex] = useState(0);
  const [motion, setMotion] = useState<"enter" | "next" | "prev">("enter");
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (shownThisVisit || source !== "basis" || !show || items.length === 0) return;
    shownThisVisit = true;
    if (markedRead(signature)) return;
    setOpen(true);
  }, [source, show, items.length, signature]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setShown(true));
      });
      return () => cancelAnimationFrame(frame);
    }
    setShown(false);
    return undefined;
  }, [open]);

  useEffect(() => {
    if (open || !mounted) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setMounted(false);
      return;
    }
    const timer = window.setTimeout(() => setMounted(false), 380);
    return () => window.clearTimeout(timer);
  }, [open, mounted]);

  function step(direction: -1 | 1) {
    const next = Math.min(items.length - 1, Math.max(0, index + direction));
    if (next === index) return;
    setMotion(direction > 0 ? "next" : "prev");
    setIndex(next);
  }

  useEffect(() => {
    if (!mounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, items.length, index]);

  function finishExit(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== "opacity" || shown || open) return;
    setMounted(false);
    setMotion("enter");
  }

  if (!mounted || items.length === 0) return null;
  const item = items[Math.min(index, items.length - 1)];
  if (!item) return null;
  const paragraphs = (item.body || item.excerpt)
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  const many = items.length > 1;
  const shownClass = shown ? "is-shown" : "";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-8">
      <button
        type="button"
        aria-label="Tutup pengumuman"
        className={`lightbox-backdrop absolute inset-0 bg-ink/45 backdrop-blur-sm ${shownClass}`}
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pengumuman-judul"
        onTransitionEnd={finishExit}
        className={`lightbox-panel relative z-10 w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-line bg-sheet shadow-xl ${shownClass}`}
      >
        <div className="lightbox-accent h-1.5 bg-brass" />
        <button
          type="button"
          aria-label="Tutup"
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-20 grid size-11 place-items-center rounded-full bg-sheet/70 text-ink ring-1 ring-line backdrop-blur-md transition-transform duration-150 ease-out active:scale-[0.96]"
        >
          <X className="size-5" />
        </button>
        <div key={item.id} className="announce-pane" data-motion={motion}>
          {item.image ? (
            <img src={item.image} alt="" className="aspect-16/9 w-full object-cover" />
          ) : (
            <div className="bg-mint px-6 pt-6 pb-2">
              <p className="text-xs font-semibold tracking-wide text-pine uppercase">Pengumuman sekolah</p>
            </div>
          )}
          <div className="px-6 pt-5 pb-6">
            <p className="text-sm text-pine">
              {formatDate(item.date)}
              {many ? ` · ${index + 1} dari ${items.length}` : ""}
            </p>
            <h2 id="pengumuman-judul" className="mt-2 font-serif text-3xl leading-tight text-ink">
              {item.title}
            </h2>
            {item.excerpt && item.body ? <p className="mt-3 text-muted">{item.excerpt}</p> : null}
            <div className="mt-3 grid max-h-48 gap-3 overflow-y-auto text-ink">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            {many ? (
              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  aria-label="Pengumuman sebelumnya"
                  disabled={index === 0}
                  onClick={() => step(-1)}
                  className="grid size-11 place-items-center rounded-full bg-sheet/50 text-ink ring-1 ring-line backdrop-blur-md transition-transform duration-150 ease-out active:scale-[0.96] disabled:opacity-35"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <div className="flex gap-1">
                  {items.map((entry, dot) => (
                    <button
                      key={entry.id}
                      type="button"
                      aria-label={`Pengumuman ${dot + 1}`}
                      onClick={() => {
                        if (dot === index) return;
                        setMotion(dot > index ? "next" : "prev");
                        setIndex(dot);
                      }}
                      className="grid size-11 place-items-center"
                    >
                      <span
                        className={
                          dot === index
                            ? "h-2.5 w-5 rounded-full bg-pine transition-all duration-300"
                            : "size-2.5 rounded-full bg-line transition-all duration-300"
                        }
                      />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Pengumuman berikutnya"
                  disabled={index === items.length - 1}
                  onClick={() => step(1)}
                  className="grid size-11 place-items-center rounded-full bg-pine text-sheet transition-transform duration-150 ease-out active:scale-[0.96] disabled:opacity-35"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            ) : null}
            <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-ink">
              <input
                type="checkbox"
                className="mt-1 size-4 accent-pine"
                checked={remember}
                onChange={(event) => {
                  const on = event.target.checked;
                  setRemember(on);
                  storeRead(signature, on);
                }}
              />
              <span>Sudah saya baca. Jangan tampilkan jendela ini lagi sampai ada pengumuman baru.</span>
            </label>
            <Link
              to="/pengumuman"
              onClick={() => setOpen(false)}
              className="mt-5 inline-flex h-11 items-center text-sm font-semibold text-pine hover:underline"
            >
              Semua pengumuman
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}