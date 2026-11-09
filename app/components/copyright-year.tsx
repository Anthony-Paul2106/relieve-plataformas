"use client";

import { useSyncExternalStore } from "react";

export function CopyrightYear() {
  const year = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => 2026,
  );
  return <>{year}</>;
}
