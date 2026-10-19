/**
 * Status gerbang situs. `open` = boleh melihat situs sebenarnya.
 * - published: admin sudah menekan Publish; semua pengunjung melihat situs.
 * - open tanpa published: hanya admin/operator yang sedang masuk (untuk memeriksa isi sebelum Publish).
 * - logoUrl: hanya diisi saat gerbang tertutup, untuk halaman "sedang dibangun".
 */
export type SiteGate = {
  open: boolean;
  published: boolean;
  logoUrl: string;
};

export const CLOSED_GATE: SiteGate = { open: false, published: false, logoUrl: "" };

/** Kata yang harus diketik admin pada jendela verifikasi Publish. */
export const PUBLISH_PHRASE = "PUBLISH";
