import { createServerFn } from "@tanstack/react-start";
import type { Profile } from "./service.server";

type Fail = { ok: false; message: string };

async function call<T>(work: () => Promise<T>): Promise<T | Fail> {
  try {
    return await work();
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Gagal memproses. Coba lagi." };
  }
}

export type { Profile };

export const getAdminLoginHint = createServerFn({ method: "GET" }).handler(async () => {
  const { adminLoginHint } = await import("./service.server.ts");
  return call(() => adminLoginHint());
});

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

export const createAdminAccount = createServerFn({ method: "POST" })
  .validator((data: { email: string; name: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { createAdminAccount: create } = await import("./service.server.ts");
    return call(() => create(data));
  });

export const getAdminGate = createServerFn({ method: "POST" }).handler(async () => {
  const { adminGate } = await import("./service.server.ts");
  return call(() => adminGate());
});

export const openAdminSession = createServerFn({ method: "POST" })
  .validator((data: { pin: string }) => data)
  .handler(async ({ data }) => {
    const { openAdminSession: open } = await import("./service.server.ts");
    return call(() => open(data.pin));
  });

export const rotateAdminPin = createServerFn({ method: "POST" })
  .validator((data: { next: string }) => data)
  .handler(async ({ data }) => {
    const { rotateAdminPin: rotate } = await import("./service.server.ts");
    return call(() => rotate(data.next));
  });

export const getTeacherDirectory = createServerFn({ method: "POST" }).handler(async () => {
  const { directory } = await import("./service.server.ts");
  return call(() => directory());
});

export const registerTeacher = createServerFn({ method: "POST" })
  .validator((data: Parameters<typeof import("./service.server.ts").registerSelf>[0]) => data)
  .handler(async ({ data }) => {
    const { registerSelf } = await import("./service.server.ts");
    return call(() => registerSelf(data));
  });

export const registerTeacherByAdmin = createServerFn({ method: "POST" })
  .validator((data: Parameters<typeof import("./service.server.ts").registerSelf>[0]) => data)
  .handler(async ({ data }) => {
    const { registerByAdmin } = await import("./service.server.ts");
    return call(() => registerByAdmin(data));
  });

export const loginTeacher = createServerFn({ method: "POST" })
  .validator((data: { rosterKey: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { login } = await import("./service.server.ts");
    return call(() => login(data));
  });

export const logoutTeacher = createServerFn({ method: "POST" }).handler(async () => {
  const { logoutTeacher: logout } = await import("./service.server.ts");
  return call(() => logout());
});

export const getTeacherProfile = createServerFn({ method: "POST" }).handler(async () => {
  const { teacherProfile } = await import("./service.server.ts");
  return call(() => teacherProfile());
});

export const saveTeacherProfile = createServerFn({ method: "POST" })
  .validator(
    (data: {
      name: string;
      gelar: string;
      nip: string;
      nuptk: string;
      phone: string;
      email: string;
      note: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { updateProfile } = await import("./service.server.ts");
    return call(() => updateProfile(data));
  });

export const changeTeacherPassword = createServerFn({ method: "POST" })
  .validator((data: { current: string; next: string }) => data)
  .handler(async ({ data }) => {
    const { changePassword } = await import("./service.server.ts");
    return call(() => changePassword(data));
  });

export const requestTeacherReset = createServerFn({ method: "POST" })
  .validator((data: { rosterKey: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { requestReset } = await import("./service.server.ts");
    return call(() => requestReset(data));
  });

export const getAdminTeacherOverview = createServerFn({ method: "POST" }).handler(async () => {
  const { adminOverview } = await import("./service.server.ts");
  return call(() => adminOverview());
});

export const decideTeacherAccount = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: "approve" | "reject" }) => data)
  .handler(async ({ data }) => {
    const { decideAccount } = await import("./service.server.ts");
    return call(() => decideAccount(data));
  });

export const decideTeacherReset = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: "approve" | "reject" }) => data)
  .handler(async ({ data }) => {
    const { decideReset } = await import("./service.server.ts");
    return call(() => decideReset(data));
  });

export const setTeacherPassword = createServerFn({ method: "POST" })
  .validator((data: { id: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { setAccountPassword } = await import("./service.server.ts");
    return call(() => setAccountPassword(data));
  });

export const exportTeacherAccounts = createServerFn({ method: "POST" }).handler(async () => {
  const { exportAccounts } = await import("./service.server.ts");
  return call(() => exportAccounts());
});

export const importTeacherAccounts = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async ({ data }) => {
    const { importAccounts } = await import("./service.server.ts");
    return call(() => importAccounts(data));
  });
