import { createServerFn } from "@tanstack/react-start";
import type { AccountRole, PanelAccount } from "./service.server";

type Fail = { ok: false; message: string };

async function call<T>(work: () => Promise<T>): Promise<T | Fail> {
  try {
    return await work();
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Gagal memproses. Coba lagi." };
  }
}

export type { AccountRole, PanelAccount };

export const getAdminAccount = createServerFn({ method: "GET" }).handler(async () => {
  const { adminAccountStatus } = await import("./service.server.ts");
  return call(() => adminAccountStatus());
});

export const loginAdminAccount = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { loginAdminAccount: login } = await import("./service.server.ts");
    return call(() => login(data.email, data.password));
  });

export const logoutAdminAccount = createServerFn({ method: "POST" }).handler(async () => {
  const { logoutAdminAccount: logout } = await import("./service.server.ts");
  return call(() => logout());
});

export const changeAdminPassword = createServerFn({ method: "POST" })
  .validator((data: { next: string }) => data)
  .handler(async ({ data }) => {
    const { changeAdminPassword: change } = await import("./service.server.ts");
    return call(() => change(data.next));
  });

export const listPanelAccounts = createServerFn({ method: "POST" }).handler(async () => {
  const { listAccounts } = await import("./service.server.ts");
  return call(() => listAccounts());
});

export const createPanelAccount = createServerFn({ method: "POST" })
  .validator((data: { email: string; name: string; password: string; role: AccountRole }) => data)
  .handler(async ({ data }) => {
    const { createAccount } = await import("./service.server.ts");
    return call(() => createAccount(data));
  });

export const updatePanelAccount = createServerFn({ method: "POST" })
  .validator(
    (data: { id: string; email: string; name: string; role: AccountRole; password?: string }) => data,
  )
  .handler(async ({ data }) => {
    const { updateAccount } = await import("./service.server.ts");
    return call(() => updateAccount(data));
  });

export const deletePanelAccount = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { deleteAccount } = await import("./service.server.ts");
    return call(() => deleteAccount(data));
  });
