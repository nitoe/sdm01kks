import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { ProgramImage } from "@/lib/site/types";

const INTERVAL_MS = 5000;

/** Slideshow semua gambar sebuah kegiatan: geser, panah, titik, papan ketik, dan putar otomatis. */
export function ProgramSlideshow({ images, title }: { images: ProgramImage[]; title: string }) {
  const count = images.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchX = useRef<number | null>(null);
  const current = count === 0 ? 0 : Math.min(index, count - 1);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (count < 2 || paused || hover || reduceMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((value) => (value + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, paused, hover, reduceMotion]);

  if (count === 0) {
    return (
      <div className="grid aspect-[4/3] w-full place-items-center rounded-2xl bg-mint text-sm text-muted">
        Gambar belum dipasang
      </div>
    );
  }

  const go = (to: number) => setIndex((to + count) % count);
  const many = count > 1;
  const button =
    "grid size-11 place-items-center rounded-full bg-sheet/85 text-ink shadow transition-colors hover:bg-sheet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine";

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`Foto ${title}`}
      tabIndex={many ? 0 : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onKeyDown={(event) => {
        if (!many) return;
        if (event.key === "ArrowLeft") go(current - 1);
        if (event.key === "ArrowRight") go(current + 1);
      }}
      onTouchStart={(event) => {
        touchX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchX.current;
        const end = event.changedTouches[0]?.clientX;
        touchX.current = null;
        if (!many || start === null || end === undefined || Math.abs(end - start) < 40) return;
        go(end < start ? current + 1 : current - 1);
      }}
      className="relative overflow-hidden rounded-2xl bg-mint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
    >
      <div
        className={`flex ${reduceMotion ? "" : "transition-transform duration-500 ease-out"}`}
        style={{ transform: `translateX(-${current * 100}%)` }}
        aria-live={paused || hover ? "polite" : "off"}
      >
        {images.map((image, i) => (
          <figure
            key={image.id || image.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} dari ${count}`}
            aria-hidden={i !== current}
            className="relative m-0 w-full flex-none"
          >
            <img
              src={image.src}
              alt={image.caption || `${title}, foto ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
              className="aspect-[4/3] w-full select-none object-cover"
            />
            {image.caption ? (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent px-4 pb-12 pt-10 text-sm text-sheet">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {many ? (
        <>
          <button
            type="button"
            aria-label="Foto sebelumnya"
            onClick={() => go(current - 1)}
            className={`${button} absolute left-3 top-1/2 -translate-y-1/2`}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Foto berikutnya"
            onClick={() => go(current + 1)}
            className={`${button} absolute right-3 top-1/2 -translate-y-1/2`}
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 px-3">
            <div className="flex items-center gap-0.5 rounded-full bg-ink/45 px-1.5 backdrop-blur-sm">
              {images.map((image, i) => (
                <button
                  key={image.id || image.src}
                  type="button"
                  aria-label={`Foto ${i + 1}`}
                  aria-current={i === current}
                  onClick={() => go(i)}
                  className="grid size-6 place-items-center"
                >
                  <span
                    className={`block rounded-full bg-sheet transition-all ${i === current ? "h-2 w-5" : "size-2 opacity-60"}`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label={paused ? "Putar otomatis" : "Jeda putar otomatis"}
              onClick={() => setPaused((value) => !value)}
              className="grid size-8 place-items-center rounded-full bg-ink/45 text-sheet backdrop-blur-sm hover:bg-ink/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sheet"
            >
              {paused ? (
                <Play className="size-3.5" aria-hidden />
              ) : (
                <Pause className="size-3.5" aria-hidden />
              )}
            </button>
          </div>
          <p
            className="absolute right-3 top-3 rounded-full bg-ink/55 px-2.5 py-1 text-xs font-semibold text-sheet"
            aria-hidden
          >
            {current + 1} / {count}
          </p>
        </>
      ) : null}
    </section>
  );
}
