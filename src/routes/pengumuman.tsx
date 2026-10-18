import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { PageIntro, Prose, SiteFrame } from "@/components/site/shell";
import { formatDate } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";
import type { Article } from "@/lib/site/types";

export const Route = createFileRoute("/pengumuman")({
  component: PengumumanPage,
});

function PengumumanPage() {
  const content = useSiteStore((state) => state.content);
  const admin = useSiteStore((state) => state.admin);
  const all = content.announcements.filter((item) => item.visible || admin);

  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const years = useMemo(() => {
    const set = new Set<string>();
    for (const item of all) {
      const y = item.date.slice(0, 4);
      if (/^\d{4}$/.test(y)) set.add(y);
    }
    return Array.from(set).sort().reverse();
  }, [all]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all
      .filter((item) => {
        if (year && !item.date.startsWith(year)) return false;
        if (month && item.date.slice(5, 7) !== month) return false;
        if (!q) return true;
        const hay = `${item.title} ${item.excerpt} ${item.body}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [all, query, year, month]);

  const openItem = filtered.find((item) => item.id === openId) ?? null;

  return (
    <SiteFrame>
      <PageIntro
        kicker="Pengumuman"
        title="Informasi untuk keluarga sekolah"
        lead="Pengumuman terbaru juga muncul saat situs dibuka. Gunakan pencarian atau saringan di bawah untuk menemukan yang dibutuhkan."
      />

      <div className="mx-auto max-w-6xl px-5 pb-16">
        <div className="mb-8 grid gap-3 rounded-2xl border border-line bg-sheet p-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="relative sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Cari judul atau isi…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-line bg-paper pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-pine/30"
            />
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="h-11 rounded-xl border border-line bg-paper px-3 text-sm"
          >
            <option value="">Semua tahun</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="h-11 rounded-xl border border-line bg-paper px-3 text-sm"
          >
            <option value="">Semua bulan</option>
            <option value="01">Januari</option>
            <option value="02">Februari</option>
            <option value="03">Maret</option>
            <option value="04">April</option>
            <option value="05">Mei</option>
            <option value="06">Juni</option>
            <option value="07">Juli</option>
            <option value="08">Agustus</option>
            <option value="09">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line px-5 py-12 text-center text-muted">
            {all.length === 0 ? "Belum ada pengumuman." : "Tidak ada pengumuman yang cocok dengan saringan."}
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-line bg-sheet shadow-sm"
              >
                {item.image ? (
                  <button
                    type="button"
                    onClick={() => setOpenId(item.id)}
                    className="group relative block bg-mint"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="aspect-[4/3] w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <span className="absolute bottom-3 right-3 rounded-full bg-sheet/90 px-2.5 py-1 text-xs font-semibold text-pine backdrop-blur-sm">
                      Lihat
                    </span>
                  </button>
                ) : null}
                <div className="flex flex-1 flex-col p-5">
                  {!item.visible ? (
                    <p className="mb-1 text-xs font-semibold text-brass">Tersembunyi dari tamu</p>
                  ) : null}
                  <p className="text-sm text-pine">{formatDate(item.date)}</p>
                  <h2 className="mt-1 font-serif text-2xl leading-tight text-ink">{item.title}</h2>
                  {item.excerpt ? <p className="mt-2 line-clamp-3 text-sm text-muted">{item.excerpt}</p> : null}
                  <button
                    type="button"
                    onClick={() => setOpenId(item.id)}
                    className="mt-4 self-start text-sm font-semibold text-pine hover:underline"
                  >
                    Baca lengkap
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {openItem ? <AnnouncementDetail item={openItem} onClose={() => setOpenId(null)} /> : null}
    </SiteFrame>
  );
}

function AnnouncementDetail({
  item,
  onClose,
}: {
  item: Article;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Tutup"
        className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-judul"
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-line bg-sheet shadow-xl"
      >
        <button
          type="button"
          aria-label="Tutup"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 grid size-10 place-items-center rounded-full bg-sheet/80 text-ink ring-1 ring-line backdrop-blur-md"
        >
          <X className="size-5" />
        </button>
        {item.image ? (
          <img src={item.image} alt="" className="w-full max-h-[60vh] object-contain bg-mint" />
        ) : (
          <div className="bg-mint px-6 pt-6 pb-2">
            <p className="text-xs font-semibold tracking-wide text-pine uppercase">Pengumuman sekolah</p>
          </div>
        )}
        <div className="px-6 pt-5 pb-6">
          <p className="text-sm text-pine">{formatDate(item.date)}</p>
          <h2 id="detail-judul" className="mt-1 font-serif text-3xl leading-tight text-ink">
            {item.title}
          </h2>
          {item.excerpt && item.body ? <p className="mt-3 text-muted">{item.excerpt}</p> : null}
          {item.body ? (
            <div className="mt-4">
              <Prose text={item.body} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
