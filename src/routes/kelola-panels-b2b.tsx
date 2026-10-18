import { useState } from "react";
import { useSiteStore } from "@/lib/site/store";
import type { SiteContent } from "@/lib/site/types";
import { changeAdminPassword, createAdminAccount } from "@/lib/teachers/api";

export function VisibilityPanel() {
  const show = useSiteStore((state) => state.content.show);
  const update = useSiteStore((state) => state.update);
  const resetContent = useSiteStore((state) => state.resetContent);
  const labels: Record<keyof SiteContent["show"], string> = {
    pengumuman: "Pengumuman di beranda",
    program: "Program",
    berita: "Berita",
    galeri: "Galeri",
    visi: "Visi dan misi",
    prestasi: "Prestasi siswa",
  };

  return (
    <div className="grid gap-4">
      <h2 className="font-serif text-3xl">Bagian halaman depan</h2>
      <p className="text-muted">Matikan sakelar untuk menyembunyikan bagian dari tamu. Identitas, beranda, dan kontak tetap tampil.</p>
      {(Object.keys(labels) as Array<keyof SiteContent["show"]>).map((key) => (
        <label key={key} className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3">
          <span className="font-semibold">{labels[key]}</span>
          <input
            type="checkbox"
            checked={show[key]}
            onChange={(event) =>
              update((content) => {
                content.show[key] = event.target.checked;
                return content;
              })
            }
            className="size-5 accent-pine"
          />
        </label>
      ))}
      <button
        type="button"
        className="mt-4 h-11 rounded-full border border-line px-4 text-sm font-semibold text-muted"
        onClick={() => {
          if (!window.confirm("Kembalikan semua isi ke data awal? Perubahan tersimpan akan hilang.")) return;
          resetContent();
        }}
      >
        Kembalikan data awal
      </button>
    </div>
  );
}

export function AccountPanel() {
  const adminEmail = useSiteStore((state) => state.adminEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [message, setMessage] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [added, setAdded] = useState("");

  return (
    <div className="grid gap-10">
      <div>
        <h2 className="font-serif text-3xl">Ganti sandi</h2>
        <p className="mt-2 text-muted">Akun yang sedang dipakai: {adminEmail || "—"}</p>
        <form
          className="mt-4 grid max-w-md gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage("");
            void changeAdminPassword({
              data: { email: adminEmail || "", currentPassword, nextPassword },
            }).then((result) => {
              setMessage(result.ok ? "Sandi diganti." : result.message);
              if (result.ok) {
                setCurrentPassword("");
                setNextPassword("");
              }
            });
          }}
        >
          <label className="text-sm font-semibold text-muted">
            Sandi sekarang
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
            />
          </label>
          <label className="text-sm font-semibold text-muted">
            Sandi baru
            <input
              type="password"
              value={nextPassword}
              onChange={(e) => setNextPassword(e.target.value)}
              className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
            />
          </label>
          {message ? <p className="text-sm">{message}</p> : null}
          <button type="submit" className="h-12 rounded-full bg-pine font-semibold text-sheet">
            Simpan sandi
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-serif text-3xl">Tambah admin</h2>
        <form
          className="mt-4 grid max-w-md gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setAdded("");
            void createAdminAccount({ data: { email: newEmail, password: newPassword } }).then((result) => {
              setAdded(result.ok ? "Admin ditambahkan." : result.message);
              if (result.ok) {
                setNewEmail("");
                setNewPassword("");
              }
            });
          }}
        >
          <label className="text-sm font-semibold text-muted">
            Surel
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
            />
          </label>
          <label className="text-sm font-semibold text-muted">
            Sandi
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
            />
          </label>
          {added ? <p className="text-sm">{added}</p> : null}
          <button type="submit" className="h-12 rounded-full border border-line font-semibold">
            Tambah admin
          </button>
        </form>
      </div>
    </div>
  );
}
