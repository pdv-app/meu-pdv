"use client";

import { useMemo, type ReactNode } from "react";
import { PermissionsProvider } from "./permissions-provider";

import type { Permissions } from "@/store/useSettingsStore";

interface UserContext {
  permissions?: Permissions;
}

function getUserContext(): UserContext | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_context="));

  if (!cookie) {
    return null;
  }

  try {
    const value = decodeURIComponent(cookie.substring("user_context=".length));

    const decoded = atob(value);

    return JSON.parse(decoded) as UserContext;
  } catch {
    return null;
  }
}

export function PermissionsProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const context = useMemo(() => getUserContext(), []);

  const permissions = context?.permissions ?? {};

  return (
    <PermissionsProvider permissions={permissions}>
      {children}
    </PermissionsProvider>
  );
}
