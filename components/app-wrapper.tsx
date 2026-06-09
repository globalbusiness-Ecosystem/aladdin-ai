"use client";

import type { ReactNode } from "react";
import { PiAuthProvider, usePiAuth } from "@/contexts/pi-auth-context";
import { I18nProvider } from "@/contexts/i18n-context";
import { AuthLoadingScreen } from "./auth-loading-screen";

function AppContent({ children }: { children: ReactNode }) {
  const { isAuthenticated, isPiBrowser } = usePiAuth();
  
  // If not in Pi Browser, show app immediately
  if (!isPiBrowser) {
    return <>{children}</>;
  }
  
  // If in Pi Browser, show loading screen until authenticated
  if (!isAuthenticated) return <AuthLoadingScreen />;
  
  return <>{children}</>;
}

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <PiAuthProvider>
        <AppContent>{children}</AppContent>
      </PiAuthProvider>
    </I18nProvider>
  );
}
