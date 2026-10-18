import { useState } from "react";
import { uid } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";
import type {
  Program,
  ProgramAchievement,
  ProgramGroup,
  ProgramGroupId,
  ProgramMedia,
} from "@/lib/site/types";
import { Field, ImageField } from "@/components/site/kelola-panels-a1";
import { ItemTools, reorder } from "@/components/site/kelola-panels-a2";

export function ProgramPanel() {
  const programs = useSiteStore((state) => state.content.programs);
  const groups = useSiteStore((state) => state.content.programGroups);
  const update = useSiteStore((state) => state.update);
  const [openId, setOpenId] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(groups[0]?.id ?? null);

  const patch = (id: string, recipe: (item: Program) => void) => {
    update((content) => {
      const item = content.programs.find((entry) => entry.id === id);
      if (item) {
        if (!Array.isArray(item.media)) item.media = [];
        recipe(item);
      }
      return content;
    });
  };

  const patchGroup = (id: ProgramGroupId, recipe: (item: ProgramGroup) => void) => {
    update((content) => {
      const item = content.programGroups.find((entry) => entry.id === id);
      if (item) recipe(item);
      return content;
    });
  };

  function add() {
    const id = uid("program");
    update((content) => {
      content.programs.unshift({
        id,
        group: "intrakurikuler",
        title: "",
        summary: "",
        body: "",
        cover: "",
        media: [],
        visible: false,
      });
      return content;
    });
    setOpenId(id);
  }

  function addAchievement(programId: string) {
    patch(programId, (item) => {
      item.achievements = [
        ...(item.achievements ?? []),
        { id: uid("prestasi"), year: "", title: "", result: "" },
      ];
    });
  }

  function patchAchievement(
    programId: string,
    achId: string,
    recipe: (a: ProgramAchievement) => void,
  ) {
    patch(programId, (item) => {
      const found = (item.achievements ?? []).find((entry) => entry.id === achId);
      if (found) recipe(found);
    });
  }

  function removeAchievement(programId: string, achId: string) {
    if (!window.confirm("Hapus prestasi ini?")) return;
    patch(programId, (item) => {
      item.achievements = (item.achievements ?? []).filter((entry) => entry.id !== achId);
    });
  }

  function addMedia(programId: string, kind: ProgramMedia["kind"]) {
    const mediaId = uid("media");
    patch(programId, (item) => {
      item.media.push({ id: mediaId, kind, src: "", caption: "" });
    });
  }

  function patchMedia(programId: string, mediaId: string, recipe: (m: ProgramMedia) => void) {
    patch(programId, (item) => {
      const m = item.media.find((entry) => entry.id === mediaId);
      if (m) recipe(m);
    });
  }

  function removeMedia(programId: string, mediaId: string) {
    if (!window.confirm("Hapus dokumentasi ini?")) return;
    patch(programId, (item) => {
      item.media = item.media.filter((entry) => entry.id !== mediaId);
    });
  }

  return (
    <div className="grid gap-4">
      <h2 className="font-serif text-3xl">Kelompok program</h2>
      <p className="text-sm text-muted">
        Tiga kelompok di bawah ini masing-masing punya halaman. Judul, uraian, dan gambar bisa
        diganti. Kegiatan di dalamnya tetap bisa disusun satu per satu.
      </p>
      <div className="grid gap-2">
        {groups.map((group) => {
          const open = openGroup === group.id;
          return (
            <article key={group.id} className="rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setOpenGroup(open ? null : group.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className="min-w-0 flex-1 truncate font-semibold">{group.title}</span>
                <span className="text-sm text-muted">
                  {group.visible ? "Tampil" : "Tersembunyi"}
                </span>
                <span className="text-sm font-semibold text-pine">{open ? "Tutup" : "Ubah"}</span>
              </button>
              {open ? (
                <div className="grid gap-3 border-t border-line p-4">
                  <Field
                    label="Judul"
                    value={group.title}
                    onChange={(value) => patchGroup(group.id, (entry) => (entry.title = value))}
                  />
                  <Field
                    label="Ringkas"
                    value={group.summary}
                    multiline
                    onChange={(value) => patchGroup(group.id, (entry) => (entry.summary = value))}
                  />
                  <Field
                    label="Uraian di halaman kelompok"
                    value={group.body}
                    multiline
                    rows={6}
                    onChange={(value) => patchGroup(group.id, (entry) => (entry.body = value))}
                  />
                  <ImageField
                    label="Gambar"
                    value={group.image}
                    onChange={(value) => patchGroup(group.id, (entry) => (entry.image = value))}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      patchGroup(group.id, (entry) => (entry.visible = !entry.visible))
                    }
                    className="h-10 w-fit rounded-full border border-line px-3 text-sm font-semibold"
                  >
                    {group.visible ? "Sembunyikan dari tamu" : "Tampilkan ke tamu"}
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-3xl">Kegiatan</h2>
        <button
          type="button"
          className="h-11 rounded-full bg-pine px-4 font-semibold text-sheet"
          onClick={add}
        >
          Tambah kegiatan
        </button>
      </div>
      {programs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-8 text-muted">
          Belum ada kegiatan.
        </p>
      ) : (
        <div className="grid gap-2">
          {programs.map((item, index) => {
            const open = openId === item.id;
            const media = item.media ?? [];
            return (
              <article key={item.id} className="rounded-xl border border-line">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span className="min-w-0 flex-1 truncate font-semibold">
                    {item.title || "Tanpa nama"}
                  </span>
                  <span className="text-sm text-muted">
                    {media.length} dokumen · {item.visible ? "Tampil" : "Tersembunyi"}
                  </span>
                  <span className="text-sm font-semibold text-pine">{open ? "Tutup" : "Ubah"}</span>
                </button>
                {open ? (
                  <div className="grid gap-3 border-t border-line p-4">
                    <Field
                      label="Nama kegiatan"
                      value={item.title}
                      onChange={(value) => patch(item.id, (entry) => (entry.title = value))}
                    />
                    <label className="block text-sm font-semibold text-muted">
                      Kelompok
                      <select
                        className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
                        value={item.group}
                        onChange={(event) =>
                          patch(
                            item.id,
                            (entry) => (entry.group = event.target.value as ProgramGroupId),
                          )
                        }
                      >
                        {groups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.title}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Field
                      label="Ringkas (daftar & beranda)"
                      value={item.summary}
                      multiline
                      onChange={(value) => patch(item.id, (entry) => (entry.summary = value))}
                    />
                    <Field
                      label="Uraian lengkap"
                      value={item.body ?? ""}
                      multiline
                      rows={8}
                      onChange={(value) => patch(item.id, (entry) => (entry.body = value))}
                    />
                    <Field
                      label="Kategori (label di kartu, mis. Olahraga, Seni, Keagamaan)"
                      value={item.category ?? ""}
                      onChange={(value) => patch(item.id, (entry) => (entry.category = value))}
                    />
                    <Field
                      label="Kegiatan kami (satu baris satu kegiatan)"
                      value={(item.activities ?? []).join("\n")}
                      multiline
                      rows={5}
                      onChange={(value) =>
                        patch(item.id, (entry) => (entry.activities = value.split("\n")))
                      }
                    />
                    <ImageField
                      label="Sampul"
                      value={item.cover ?? ""}
                      onChange={(value) => patch(item.id, (entry) => (entry.cover = value))}
                    />

                    <div className="mt-2 rounded-xl border border-line bg-paper p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-pine">Prestasi</p>
                        <button
                          type="button"
                          className="h-9 rounded-full border border-line bg-sheet px-3 text-sm font-semibold"
                          onClick={() => addAchievement(item.id)}
                        >
                          + Prestasi
                        </button>
                      </div>
                      {(item.achievements ?? []).length === 0 ? (
                        <p className="mt-3 text-sm text-muted">Belum ada prestasi.</p>
                      ) : (
                        <div className="mt-3 grid gap-3">
                          {(item.achievements ?? []).map((a) => (
                            <div
                              key={a.id}
                              className="grid gap-2 rounded-xl border border-line bg-sheet p-3"
                            >
                              <Field
                                label="Tahun"
                                value={a.year}
                                onChange={(value) =>
                                  patchAchievement(item.id, a.id, (entry) => (entry.year = value))
                                }
                              />
                              <Field
                                label="Peringkat / judul (mis. Juara 1)"
                                value={a.title}
                                onChange={(value) =>
                                  patchAchievement(item.id, a.id, (entry) => (entry.title = value))
                                }
                              />
                              <Field
                                label="Nama lomba dan tingkat"
                                value={a.result}
                                onChange={(value) =>
                                  patchAchievement(item.id, a.id, (entry) => (entry.result = value))
                                }
                              />
                              <button
                                type="button"
                                className="h-9 w-fit px-2 text-sm font-semibold text-pine-deep"
                                onClick={() => removeAchievement(item.id, a.id)}
                              >
                                Hapus prestasi
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-2 rounded-xl border border-line bg-paper p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-pine">Dokumentasi</p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="h-9 rounded-full border border-line bg-sheet px-3 text-sm font-semibold"
                            onClick={() => addMedia(item.id, "image")}
                          >
                            + Foto
                          </button>
                          <button
                            type="button"
                            className="h-9 rounded-full border border-line bg-sheet px-3 text-sm font-semibold"
                            onClick={() => addMedia(item.id, "video")}
                          >
                            + Video
                          </button>
                          <button
                            type="button"
                            className="h-9 rounded-full border border-line bg-sheet px-3 text-sm font-semibold"
                            onClick={() => addMedia(item.id, "url")}
                          >
                            + Tautan
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted">
                        Foto: unggah atau tautan gambar. Video: berkas video atau tautan file.
                        Tautan: YouTube, Instagram, atau situs lain.
                      </p>
                      {media.length === 0 ? (
                        <p className="mt-3 text-sm text-muted">Belum ada dokumentasi.</p>
                      ) : (
                        <div className="mt-3 grid gap-3">
                          {media.map((m) => (
                            <div key={m.id} className="rounded-xl border border-line bg-sheet p-3">
                              <p className="text-sm font-semibold text-muted">
                                {m.kind === "image"
                                  ? "Foto"
                                  : m.kind === "video"
                                    ? "Video"
                                    : "Tautan eksternal"}
                              </p>
                              {m.kind === "image" ? (
                                <div className="mt-2">
                                  <ImageField
                                    label="Gambar"
                                    value={m.src}
                                    onChange={(value) =>
                                      patchMedia(item.id, m.id, (entry) => (entry.src = value))
                                    }
                                  />
                                </div>
                              ) : (
                                <div className="mt-2">
                                  <Field
                                    label={
                                      m.kind === "video"
                                        ? "Tautan atau alamat berkas video"
                                        : "URL (YouTube, Instagram, dll.)"
                                    }
                                    value={m.src}
                                    onChange={(value) =>
                                      patchMedia(item.id, m.id, (entry) => (entry.src = value))
                                    }
                                  />
                                </div>
                              )}
                              <div className="mt-2">
                                <Field
                                  label="Keterangan"
                                  value={m.caption}
                                  onChange={(value) =>
                                    patchMedia(item.id, m.id, (entry) => (entry.caption = value))
                                  }
                                />
                              </div>
                              <button
                                type="button"
                                className="mt-2 h-9 px-2 text-sm font-semibold text-pine-deep"
                                onClick={() => removeMedia(item.id, m.id)}
                              >
                                Hapus dokumentasi
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <ItemTools
                      index={index}
                      count={programs.length}
                      visible={item.visible}
                      onMove={(dir) =>
                        update((content) => {
                          content.programs = reorder(content.programs, index, dir);
                          return content;
                        })
                      }
                      onToggle={() => patch(item.id, (entry) => (entry.visible = !entry.visible))}
                      onRemove={() => {
                        if (!window.confirm("Hapus program ini?")) return;
                        update((content) => {
                          content.programs = content.programs.filter(
                            (entry) => entry.id !== item.id,
                          );
                          return content;
                        });
                        setOpenId(null);
                      }}
                    />
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
