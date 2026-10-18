import type { Program, ProgramImage } from "./types";

/** Semua gambar sebuah kegiatan. Data lama yang hanya punya `cover` tetap terbaca sebagai satu gambar. */
export function programImages(program: Pick<Program, "images" | "cover">): ProgramImage[] {
  const saved = (program.images ?? []).filter((item) => item.src);
  if (saved.length) return saved;
  return program.cover ? [{ id: "cover", src: program.cover, caption: "" }] : [];
}

/** Ubah nomor telepon Indonesia (08…, +62…, 62…) menjadi tautan WhatsApp. */
export function whatsappLink(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith("8")) digits = `62${digits}`;
  return digits.length >= 10 && digits.startsWith("62") ? `https://wa.me/${digits}` : null;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
