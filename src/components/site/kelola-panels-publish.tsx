import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSiteGate, publishSiteNow } from "@/lib/site/gate";
import { PUBLISH_PHRASE } from "@/lib/site/gate-types";

export function PublishPanel() {
  const router = useRouter();
  const [published, setPublished] = useState<boolean | null>(null);
  const [dialog, setDialog] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    void getSiteGate().then((gate) => setPublished(gate.published));
  }, []);

  return (
    <div className="grid max-w-2xl gap-5">
      <h2 className="font-serif text-3xl">Publikasi situs</h2>

      <div
        className={`rounded-xl border px-4 py-3 ${
          published ? "border-pine bg-mint text-pine-deep" : "border-line bg-paper text-ink"
        }`}
      >
        <p className="font-semibold">
          {published === null
            ? "Memeriksa status…"
            : published
              ? "Situs sudah dipublikasikan"
              : "Situs belum dipublikasikan"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {published
            ? "Semua pengunjung melihat situs sebenarnya. Halaman 404 tidak lagi dipakai."
            : "Semua pengunjung melihat halaman 404 \"website sedang dibangun\". Admin dan operator yang sudah masuk tetap melihat situs sebenarnya untuk memeriksa isinya."}
        </p>
      </div>

      {notice ? <p className="text-sm font-semibold text-pine">{notice}</p> : null}

      {published === false ? (
        <div>
          <p className="text-muted">
            Publish membuka beranda dan semua halaman untuk umum. Pastikan identitas, sambutan, program,
            berita, dan kontak sudah benar. Hanya admin yang bisa menerbitkan.
          </p>
          <button
            type="button"
            onClick={() => {
              setNotice("");
              setDialog(true);
            }}
            className="mt-4 h-12 rounded-full bg-pine px-8 font-semibold text-sheet hover:bg-pine-deep"
          >
            Publish situs
          </button>
        </div>
      ) : null}

      {dialog ? (
        <PublishDialog
          onClose={() => setDialog(false)}
          onDone={(message) => {
            setDialog(false);
            setPublished(true);
            setNotice(message);
            void router.invalidate();
          }}
        />
      ) : null}
    </div>
  );
}

function PublishDialog({ onClose, onDone }: { onClose: () => void; onDone: (message: string) => void }) {
  const [checked, setChecked] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const ready = checked && phrase.trim() === PUBLISH_PHRASE && password.length > 0 && !busy;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4" role="presentation">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="publish-title"
        className="w-full max-w-md rounded-card border border-line bg-sheet p-6 shadow-xl"
        onSubmit={(event) => {
          event.preventDefault();
          if (!ready) return;
          setBusy(true);
          setError("");
          void publishSiteNow({ data: { password, phrase } }).then((result) => {
            setBusy(false);
            if (!result.ok) {
              setError(result.message);
              return;
            }
            onDone(result.message ?? "Situs dipublikasikan.");
          });
        }}
      >
        <h3 id="publish-title" className="font-serif text-2xl">
          Terbitkan situs sekarang?
        </h3>
        <p className="mt-2 text-sm text-muted">
          Setelah diterbitkan, siapa pun yang membuka sdmuhammadiyah01kks.sch.id langsung melihat situs
          sebenarnya. Halaman 404 tidak dipakai lagi.
        </p>

        <label className="mt-5 flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-pine"
          />
          <span>Saya sudah memeriksa semua isi situs dan informasinya sudah benar.</span>
        </label>

        <label className="mt-4 block text-sm font-semibold text-muted">
          Ketik {PUBLISH_PHRASE} untuk melanjutkan
          <input
            value={phrase}
            onChange={(event) => setPhrase(event.target.value)}
            className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3 text-ink"
            autoComplete="off"
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-muted">
          Sandi akun admin Anda
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3 text-ink"
            autoComplete="current-password"
          />
        </label>

        {error ? <p className="mt-3 text-sm text-pine-deep">{error}</p> : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="h-11 rounded-full border border-line px-5 font-semibold text-muted"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={!ready}
            className="h-11 rounded-full bg-pine px-6 font-semibold text-sheet disabled:opacity-50"
          >
            {busy ? "Menerbitkan…" : "Terbitkan"}
          </button>
        </div>
      </form>
    </div>
  );
}
