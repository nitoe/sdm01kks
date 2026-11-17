import type { ReactNode } from "react";

/** Bintang bersudut delapan, penanda kecil di sebelah judul kecil (eyebrow). */
export function StarMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.00 1.50 L15.08 4.58 L19.42 4.58 L19.42 8.92 L22.50 12.00 L19.42 15.08 L19.42 19.42 L15.08 19.42 L12.00 22.50 L8.92 19.42 L4.58 19.42 L4.58 15.08 L1.50 12.00 L4.58 8.92 L4.58 4.58 L8.92 4.58Z" />
    </svg>
  );
}

/** Judul kecil di atas judul bagian. `tone="light"` untuk latar gelap. */
export function Eyebrow({
  children,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  const color = tone === "light" ? "text-sun" : "text-pine";
  return (
    <p
      className={`inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase ${color} ${className}`}
    >
      <StarMark className="size-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/** Judul bagian di halaman dalam: judul serif dengan garis kuning pendek. */
export function SectionTitle({
  children,
  sub,
  id,
}: {
  children: ReactNode;
  sub?: string;
  id?: string;
}) {
  return (
    <div>
      <h2 id={id} className="font-serif text-2xl font-semibold text-ink md:text-3xl">
        {children}
      </h2>
      <span className="mt-3 block h-1 w-10 rounded-full bg-sun" aria-hidden="true" />
      {sub ? <p className="mt-3 max-w-2xl text-muted">{sub}</p> : null}
    </div>
  );
}
