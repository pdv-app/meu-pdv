"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

import { hasPermission } from "@/lib/permissions";

import type {
  ActionKey,
  ModuleKey,
  Permissions,
} from "@/store/useSettingsStore";

interface PermissionsContextValue {
  permissions: Permissions;
  can: (module: ModuleKey, action: ActionKey) => boolean;
}

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

interface PermissionsProviderProps {
  permissions: Permissions;
  children: ReactNode;
}

export function PermissionsProvider({
  permissions,
  children,
}: PermissionsProviderProps) {
  const value = useMemo<PermissionsContextValue>(
    () => ({
      permissions,
      can: (module, action) => hasPermission(permissions, module, action),
    }),
    [permissions],
  );

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);

  if (!context) {
    throw new Error(
      "usePermissions deve ser usado dentro de PermissionsProvider.",
    );
  }

  return context;
}
