import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageIntro, SiteFrame } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";

export const Route = createFileRoute("/prestasi")({
  component: PrestasiPage,
});

function PrestasiPage() {
  const content = useSiteStore((state) => state.content);
  const admin = useSiteStore((state) => state.admin);
  const items = content.achievements.filter((item) => item.visible || admin);

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category).filter(Boolean))).sort(),
    [items],
  );
  const years = useMemo(
    () => Array.from(new Set(items.map((item) => item.year).filter(Boolean))).sort((a, b) => b.localeCompare(a)),
    [items],
  );
  const levels = useMemo(
    () => Array.from(new Set(items.map((item) => item.level).filter(Boolean))).sort(),
    [items],
  );

  const [category, setCategory] = useState("semua");
  const [year, setYear] = useState("semua");
  const [level, setLevel] = useState("semua");
  const [query, setQuery] = useState("");

  const filtered = items.filter((item) => {
    if (category !== "semua" && item.category !== category) return false;
    if (year !== "semua" && item.year !== year) return false;
    if (level !== "semua" && item.level !== level) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const hay = `${item.title} ${item.student} ${item.result} ${item.note}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <SiteFrame>
      <PageIntro
        kicker="Prestasi"
        title="Prestasi peserta didik"
        lead="Filter menurut jenis lomba, tahun, dan tingkat. Data diisi dari panel kelola."
      />
      {!content.show.prestasi && !admin ? (
        <p className="mx-auto max-w-6xl px-5 text-muted">Bagian prestasi sedang tidak ditampilkan.</p>
      ) : (
        <div className="mx-auto max-w-6xl px-5 pb-16">
          <div className="grid gap-3 rounded-card border border-line bg-sheet p-4 md:grid-cols-4">
            <label className="text-sm font-semibold text-muted">
              Cari
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nama, lomba, hasil…"
                className="mt-1 h-11 w-full rounded-xl border border-line bg-paper px-3 font-normal text-ink"
              />
            </label>
            <label className="text-sm font-semibold text-muted">
              Jenis lomba
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-line bg-paper px-3 font-normal text-ink"
              >
                <option value="semua">Semua</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-muted">
              Tahun
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-line bg-paper px-3 font-normal text-ink"
              >
                <option value="semua">Semua</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-muted">
              Tingkat
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-line bg-paper px-3 font-normal text-ink"
              >
                <option value="semua">Semua</option>
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="mt-4 text-sm text-muted">
            Menampilkan {filtered.length} dari {items.length} prestasi
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filtered.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-card border border-line bg-sheet">
                {item.image ? (
                  <img src={item.image} alt="" className="aspect-3/2 w-full object-cover" />
                ) : null}
                <div className="p-6">
                  {!item.visible ? <p className="text-sm text-brass">Tersembunyi dari tamu</p> : null}
                  <p className="text-sm text-brass">
                    {item.year} · {item.level} · {item.category}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl">{item.title}</h2>
                  <p className="mt-2 font-semibold text-pine">{item.result}</p>
                  <p className="mt-2 text-muted">{item.student}</p>
                  {item.note ? <p className="mt-3 text-sm text-muted">{item.note}</p> : null}
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="mt-8 rounded-card border border-dashed border-line px-5 py-10 text-center text-muted">
              Tidak ada prestasi yang cocok dengan filter ini.
            </p>
          ) : null}
        </div>
      )}
    </SiteFrame>
  );
}
