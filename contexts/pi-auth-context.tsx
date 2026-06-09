"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { PI_NETWORK_CONFIG } from "@/lib/system-config";

interface PiAuthContextType {
  isAuthenticated: boolean;
  authMessage: string;
  hasError: boolean;
  sdk: any;
  products: any[] | null;
  restoredPurchases: any[] | null;
  reinitialize: () => Promise<void>;
  isPiBrowser: boolean;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("Initializing...");
  const [hasError, setHasError] = useState(false);
  const [sdk, setSdk] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [restoredPurchases, setRestoredPurchases] = useState<any[]>([]);
  const [isPiBrowser, setIsPiBrowser] = useState(false);

  const initialize = async () => {
    const hasPi = typeof window !== "undefined" && typeof window.Pi !== "undefined";
    setIsPiBrowser(hasPi);

    if (!hasPi) {
      setIsAuthenticated(true);
      setProducts([]);
      setRestoredPurchases([]);
      return;
    }

    try {
      setAuthMessage("Loading Pi SDK...");
      await window.Pi.init({ version: "2.0", sandbox: PI_NETWORK_CONFIG.SANDBOX });
      setAuthMessage("Authenticating...");
      const auth = await window.Pi.authenticate(["payments", "username"], () => {});
      if (auth) {
        setIsAuthenticated(true);
        setAuthMessage("Authenticated!");
      }
    } catch (err: any) {
      setHasError(true);
      setAuthMessage(err?.message || "Authentication failed");
    }
  };

  useEffect(() => { initialize(); }, []);

  return (
    <PiAuthContext.Provider value={{ isAuthenticated, authMessage, hasError, sdk, products, restoredPurchases, reinitialize: initialize, isPiBrowser }}>
      {children}
    </PiAuthContext.Provider>
  );
}

export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (!context) throw new Error("usePiAuth must be used within PiAuthProvider");
  return context;
}
