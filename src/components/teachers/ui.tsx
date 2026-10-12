import { Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { Mark } from "@/components/site/shell";
import { dutiesBySubject, signatureName, type Duty } from "@/lib/teachers/logic";
import { SCHOOL_YEAR } from "@/lib/teachers/roster";

export const GELAR_HINTS = ["S.Pd", "S.Pd.I", "S.Pd.SD", "S.Ag", "M.Pd"];

export function GuruChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-sheet">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-4">
          <Mark className="size-10 shrink-0" />
          <div className="min-w-0">
            <p className="font-serif text-xl">Akun guru</p>
            <p className="truncate text-sm text-muted">SD Muhammadiyah 01 Kukusan</p>
          </div>
          <div className="ml-auto flex gap-4">
            <Link to="/" className="text-sm font-semibold text-muted">
              Publik
            </Link>
            <Link to="/kelola" className="text-sm font-semibold text-pine">
              Admin
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-8">{children}</main>
    </div>
  );
}

export function SecretField({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
}) {
  const [shown, setShown] = useState(false);
  return (
    <label className="block text-sm font-semibold text-muted">
      {label}
      <span className="relative mt-1 block">
        <input
          type={shown ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className="h-12 w-full rounded-xl border border-line bg-paper px-3 pr-32"
        />
        <button
          type="button"
          aria-pressed={shown}
          onClick={() => setShown((current) => !current)}
          className="absolute top-1 right-1 h-10 rounded-lg px-3 text-sm font-semibold text-pine"
        >
          {shown ? "Sembunyikan" : "Tampilkan"}
        </button>
      </span>
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-muted">
      {label}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
      />
    </label>
  );
}

export function NameSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: string; name: string }[];
  value: string;
  onChange: (key: string) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = needle ? options.filter((option) => option.name.toLowerCase().includes(needle)) : options;
    if (value && !list.some((option) => option.key === value)) {
      const selected = options.find((option) => option.key === value);
      if (selected) return [selected, ...list];
    }
    return list;
  }, [options, query, value]);

  return (
    <div>
      <label className="block text-sm font-semibold text-muted">
        Cari nama
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ketik sebagian nama"
          className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
        />
      </label>
      <label className="mt-3 block text-sm font-semibold text-muted">
        {label}
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
        >
          <option value="">Pilih nama guru</option>
          {filtered.map((option) => (
            <option key={option.key} value={option.key}>
              {option.name}
            </option>
          ))}
        </select>
      </label>
      {options.length === 0 ? <p className="mt-2 text-sm text-muted">Tidak ada nama di daftar ini.</p> : null}
      {options.length > 0 && filtered.length === 0 ? (
        <p className="mt-2 text-sm text-muted">Tidak ada nama yang cocok.</p>
      ) : null}
    </div>
  );
}

export function DutyList({ duties }: { duties: Duty[] }) {
  const groups = dutiesBySubject(duties);
  if (groups.length === 0) {
    return <p className="text-sm text-muted">Belum ada tugas di daftar {SCHOOL_YEAR}.</p>;
  }
  return (
    <ul className="grid gap-2">
      {groups.map((group) => (
        <li key={group.mapel} className="rounded-xl bg-paper px-3 py-2">
          <p className="font-semibold text-ink">{group.mapel}</p>
          <p className="text-sm text-muted">{group.kelas.join(", ")}</p>
        </li>
      ))}
    </ul>
  );
}

export function SignaturePreview({ name, gelar }: { name: string; gelar: string }) {
  const line = signatureName(name, gelar);
  return (
    <div className="rounded-xl border border-line bg-brass-soft px-4 py-3">
      <p className="text-sm font-semibold text-muted">Tulisan di rapor</p>
      <p className="mt-1 font-serif text-2xl text-ink">{line || "Nama guru"}</p>
    </div>
  );
}

export function GelarHints({ onPick }: { onPick: (gelar: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {GELAR_HINTS.map((gelar) => (
        <button
          key={gelar}
          type="button"
          onClick={() => onPick(gelar)}
          className="h-10 rounded-full border border-line bg-sheet px-3 text-sm font-semibold text-ink"
        >
          {gelar}
        </button>
      ))}
    </div>
  );
}

export function statusLabel(status: string): string {
  if (status === "active") return "Aktif";
  if (status === "pending") return "Menunggu";
  if (status === "rejected") return "Ditolak";
  return status;
}
