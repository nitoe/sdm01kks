import { useCallback, useEffect, useState } from "react";
import {
  createPanelAccount,
  deletePanelAccount,
  listPanelAccounts,
  updatePanelAccount,
  type AccountRole,
  type PanelAccount,
} from "@/lib/teachers/api";

const ROLE_LABEL: Record<AccountRole, string> = { admin: "Admin", operator: "Operator" };

const inputClass = "mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3";

function RoleSelect({
  value,
  onChange,
  disabled,
}: {
  value: AccountRole;
  onChange: (role: AccountRole) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value === "admin" ? "admin" : "operator")}
      className={`${inputClass} disabled:opacity-60`}
    >
      <option value="operator">Operator — kelola isi situs, tanpa kelola akun</option>
      <option value="admin">Admin — semua akses, termasuk kelola akun</option>
    </select>
  );
}

function AccountRow({ account, onChanged }: { account: PanelAccount; onChanged: (message: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(account.name);
  const [email, setEmail] = useState(account.email);
  const [role, setRole] = useState<AccountRole>(account.role);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function open() {
    setName(account.name);
    setEmail(account.email);
    setRole(account.role);
    setPassword("");
    setError("");
    setEditing(true);
  }

  async function save() {
    setBusy(true);
    setError("");
    const result = await updatePanelAccount({
      data: { id: account.id, name, email, role, password: password || undefined },
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setEditing(false);
    onChanged(result.message ?? "Akun diperbarui.");
  }

  async function remove() {
    if (!window.confirm(`Hapus akun ${account.email}? Orang ini tidak bisa masuk lagi.`)) return;
    setBusy(true);
    const result = await deletePanelAccount({ data: { id: account.id } });
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onChanged(result.message ?? "Akun dihapus.");
  }

  return (
    <li className="rounded-xl border border-line p-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink">
            {account.name}
            {account.isSelf ? <span className="ml-2 text-xs font-medium text-muted">(akun Anda)</span> : null}
          </p>
          <p className="truncate text-sm text-muted">{account.email}</p>
        </div>
        <span
          className={
            account.role === "admin"
              ? "inline-flex h-7 items-center rounded-full bg-pine px-2.5 text-xs font-semibold text-sheet"
              : "inline-flex h-7 items-center rounded-full bg-mint px-2.5 text-xs font-semibold text-pine"
          }
        >
          {ROLE_LABEL[account.role]}
        </span>
        {!editing ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={open}
              className="h-10 rounded-full border border-line px-4 text-sm font-semibold"
            >
              Ubah
            </button>
            <button
              type="button"
              onClick={() => void remove()}
              disabled={account.isSelf || busy}
              title={account.isSelf ? "Akun yang sedang dipakai tidak bisa dihapus" : undefined}
              className="h-10 rounded-full border border-line px-4 text-sm font-semibold text-muted disabled:opacity-40"
            >
              Hapus
            </button>
          </div>
        ) : null}
      </div>

      {editing ? (
        <form
          className="mt-4 grid max-w-md gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <label className="text-sm font-semibold text-muted">
            Nama
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </label>
          <label className="text-sm font-semibold text-muted">
            Surel
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </label>
          <label className="text-sm font-semibold text-muted">
            Peran
            <RoleSelect value={role} onChange={setRole} disabled={account.isSelf} />
            {account.isSelf ? (
              <span className="mt-1 block text-xs font-normal">Peran akun sendiri tidak bisa diubah.</span>
            ) : null}
          </label>
          <label className="text-sm font-semibold text-muted">
            Sandi baru (kosongkan bila tidak diganti)
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              autoComplete="new-password"
            />
          </label>
          {error ? <p className="text-sm text-pine-deep">{error}</p> : null}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="h-11 rounded-full bg-pine px-5 font-semibold text-sheet disabled:opacity-60"
            >
              {busy ? "Menyimpan…" : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="h-11 rounded-full border border-line px-5 font-semibold"
            >
              Batal
            </button>
          </div>
        </form>
      ) : error ? (
        <p className="mt-2 text-sm text-pine-deep">{error}</p>
      ) : null}
    </li>
  );
}

export function AccountManagerPanel() {
  const [accounts, setAccounts] = useState<PanelAccount[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<AccountRole>("operator");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  const reload = useCallback(async () => {
    const result = await listPanelAccounts();
    if (!result.ok) {
      setLoadError(result.message);
      return;
    }
    setLoadError("");
    setAccounts(result.accounts);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function add() {
    setAdding(true);
    setAddError("");
    setNotice("");
    const result = await createPanelAccount({
      data: { email: newEmail, name: newName, password: newPassword, role: newRole },
    });
    setAdding(false);
    if (!result.ok) {
      setAddError(result.message);
      return;
    }
    setNotice(result.message ?? "Akun ditambahkan.");
    setNewEmail("");
    setNewName("");
    setNewPassword("");
    setNewRole("operator");
    void reload();
  }

  return (
    <div className="grid gap-10">
      <div>
        <h2 className="font-serif text-3xl">Kelola akun</h2>
        <p className="mt-2 max-w-2xl text-muted">
          <strong className="text-ink">Operator</strong> bisa mengubah semua isi situs seperti admin, tetapi tidak
          bisa melihat atau mengubah akun. <strong className="text-ink">Admin</strong> juga mengelola akun di
          halaman ini.
        </p>
        {notice ? <p className="mt-3 rounded-xl bg-mint px-4 py-3 text-sm text-pine">{notice}</p> : null}
        {loadError ? <p className="mt-3 text-sm text-pine-deep">{loadError}</p> : null}
        {accounts === null && !loadError ? <p className="mt-4 text-muted">Memuat akun…</p> : null}
        {accounts ? (
          <ul className="mt-4 grid gap-3">
            {accounts.map((account) => (
              <AccountRow
                key={account.id}
                account={account}
                onChanged={(message) => {
                  setNotice(message);
                  void reload();
                }}
              />
            ))}
          </ul>
        ) : null}
      </div>

      <div>
        <h2 className="font-serif text-3xl">Tambah akun</h2>
        <p className="mt-2 text-muted">Berikan surel dan sandi awal kepada orangnya. Ia bisa menggantinya di tab Sandi.</p>
        <form
          className="mt-4 grid max-w-md gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void add();
          }}
        >
          <label className="text-sm font-semibold text-muted">
            Surel
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={inputClass} />
          </label>
          <label className="text-sm font-semibold text-muted">
            Nama
            <input value={newName} onChange={(e) => setNewName(e.target.value)} className={inputClass} />
          </label>
          <label className="text-sm font-semibold text-muted">
            Sandi awal
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              autoComplete="new-password"
            />
          </label>
          <label className="text-sm font-semibold text-muted">
            Peran
            <RoleSelect value={newRole} onChange={setNewRole} />
          </label>
          {addError ? <p className="text-sm text-pine-deep">{addError}</p> : null}
          <button
            type="submit"
            disabled={adding}
            className="h-12 rounded-full bg-pine font-semibold text-sheet disabled:opacity-60"
          >
            {adding ? "Menambah…" : "Tambah akun"}
          </button>
        </form>
      </div>
    </div>
  );
}
