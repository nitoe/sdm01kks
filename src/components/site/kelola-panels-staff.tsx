import { useState } from "react";
import { uid } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";
import type { StaffMember } from "@/lib/site/types";
import { Field, ImageField } from "@/components/site/kelola-panels-a1";
import { ItemTools, reorder } from "@/components/site/kelola-panels-a2";

export function StaffPanel() {
  const staff = useSiteStore((state) => state.content.staff ?? []);
  const update = useSiteStore((state) => state.update);
  const [openId, setOpenId] = useState<string | null>(null);

  const patch = (id: string, recipe: (item: StaffMember) => void) => {
    update((content) => {
      const item = (content.staff ?? []).find((entry) => entry.id === id);
      if (item) recipe(item);
      return content;
    });
  };

  function add() {
    const id = uid("staff");
    update((content) => {
      if (!content.staff) content.staff = [];
      content.staff.unshift({
        id,
        name: "",
        role: "Guru",
        photo: "",
        duties: "",
        visible: false,
      });
      return content;
    });
    setOpenId(id);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl">Manajerial sekolah</h2>
          <p className="mt-1 text-muted">
            Kepala sekolah, wakil, dan guru yang tampil di halaman Profil. Urutan bisa diatur. Yang tersembunyi tidak
            terlihat tamu.
          </p>
        </div>
        <button type="button" className="h-11 rounded-full bg-pine px-4 font-semibold text-sheet" onClick={add}>
          Tambah orang
        </button>
      </div>

      {staff.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-8 text-muted">
          Belum ada. Tekan tambah untuk memasukkan kepala, wakil, atau guru.
        </p>
      ) : (
        <div className="grid gap-2">
          {staff.map((item, index) => {
            const open = openId === item.id;
            return (
              <article key={item.id} className="rounded-xl border border-line">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{item.name || "Tanpa nama"}</span>
                    <span className="block text-sm text-muted">{item.role || "Tanpa jabatan"}</span>
                  </span>
                  <span className="text-sm text-muted">{item.visible ? "Tampil" : "Tersembunyi"}</span>
                  <span className="text-sm font-semibold text-pine">{open ? "Tutup" : "Ubah"}</span>
                </button>
                {open ? (
                  <div className="grid gap-3 border-t border-line p-4">
                    <Field
                      label="Nama"
                      value={item.name}
                      onChange={(value) => patch(item.id, (entry) => (entry.name = value))}
                    />
                    <Field
                      label="Jabatan / peran"
                      value={item.role}
                      onChange={(value) => patch(item.id, (entry) => (entry.role = value))}
                    />
                    <ImageField
                      label="Foto"
                      value={item.photo ?? ""}
                      onChange={(value) => patch(item.id, (entry) => (entry.photo = value))}
                    />
                    <Field
                      label="Tugas atau keterangan singkat"
                      value={item.duties}
                      multiline
                      rows={4}
                      onChange={(value) => patch(item.id, (entry) => (entry.duties = value))}
                    />
                    <ItemTools
                      index={index}
                      count={staff.length}
                      visible={item.visible}
                      onMove={(dir) =>
                        update((content) => {
                          content.staff = reorder(content.staff ?? [], index, dir);
                          return content;
                        })
                      }
                      onToggle={() => patch(item.id, (entry) => (entry.visible = !entry.visible))}
                      onRemove={() => {
                        if (!window.confirm("Hapus orang ini dari profil?")) return;
                        update((content) => {
                          content.staff = (content.staff ?? []).filter((entry) => entry.id !== item.id);
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
