import { Field, ImageField } from "@/components/site/kelola-panels-a1";
import { useSiteStore } from "@/lib/site/store";
import type { SchoolValue } from "@/lib/site/types";

export function WelcomePanel() {
  const welcome = useSiteStore((state) => state.content.welcome);
  const update = useSiteStore((state) => state.update);
  const set = (key: keyof typeof welcome, value: string) => {
    update((content) => {
      content.welcome = { ...content.welcome, [key]: value };
      return content;
    });
  };

  return (
    <div className="grid gap-4">
      <h2 className="font-serif text-3xl">Sambutan kepala sekolah</h2>
      <p className="text-muted">
        Tampil di bawah bagian atas halaman depan. Nama, kalimat, dan foto bisa diganti kapan saja.
      </p>
      <Field label="Baris kecil" value={welcome.kicker} onChange={(value) => set("kicker", value)} />
      <Field label="Judul" value={welcome.title} multiline onChange={(value) => set("title", value)} />
      <Field label="Nama" value={welcome.name} onChange={(value) => set("name", value)} />
      <Field label="Jabatan" value={welcome.role} onChange={(value) => set("role", value)} />
      <Field
        label="Sambutan"
        value={welcome.body}
        multiline
        rows={10}
        onChange={(value) => set("body", value)}
      />
      <p className="text-sm text-muted">Pisahkan paragraf dengan baris kosong.</p>
      <ImageField label="Foto" value={welcome.image} onChange={(value) => set("image", value)} />
      <Field
        label="Keterangan foto"
        value={welcome.imageCaption}
        onChange={(value) => set("imageCaption", value)}
      />
    </div>
  );
}

export function ValuesPanel() {
  const values = useSiteStore((state) => state.content.values);
  const update = useSiteStore((state) => state.update);

  function patch(id: string, recipe: (item: SchoolValue) => void) {
    update((content) => {
      const item = content.values.find((entry) => entry.id === id);
      if (item) recipe(item);
      return content;
    });
  }

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="font-serif text-3xl">Nilai sekolah</h2>
        <p className="mt-2 text-muted">
          Tiga kartu di bawah sambutan kepala sekolah. Judul, kalimat, dan gambar masing-masing bisa diganti.
        </p>
      </div>
      {values.map((item, index) => (
        <fieldset key={item.id} className="grid gap-4 rounded-2xl border border-line p-4">
          <legend className="px-1 font-semibold text-pine">Kartu {index + 1}</legend>
          <Field label="Judul" value={item.title} onChange={(value) => patch(item.id, (entry) => (entry.title = value))} />
          <Field
            label="Kalimat"
            value={item.text}
            multiline
            onChange={(value) => patch(item.id, (entry) => (entry.text = value))}
          />
          <ImageField
            label="Gambar"
            value={item.image}
            onChange={(value) => patch(item.id, (entry) => (entry.image = value))}
          />
          <label className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3">
            <span className="text-sm font-semibold">Tampilkan di halaman depan</span>
            <input
              type="checkbox"
              checked={item.visible}
              onChange={(event) => patch(item.id, (entry) => (entry.visible = event.target.checked))}
              className="size-5 accent-pine"
            />
          </label>
          <button
            type="button"
            className="h-11 justify-self-start rounded-full px-4 text-sm font-semibold text-muted"
            onClick={() =>
              update((content) => {
                content.values = content.values.filter((entry) => entry.id !== item.id);
                return content;
              })
            }
          >
            Hapus kartu
          </button>
        </fieldset>
      ))}
      <button
        type="button"
        className="h-11 justify-self-start rounded-full bg-pine px-5 text-sm font-semibold text-sheet"
        onClick={() =>
          update((content) => {
            content.values.push({
              id: `nilai-${Date.now()}`,
              title: "Nilai baru",
              text: "",
              image: "",
              visible: true,
            });
            return content;
          })
        }
      >
        Tambah kartu
      </button>
    </div>
  );
}
