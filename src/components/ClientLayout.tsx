'use client';

import { ReactNode } from 'react';
import { SettingsProvider } from "@/contexts/SettingsContext";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>;
}
