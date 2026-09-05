"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "showBackgroundImages";

const BackgroundContext = createContext<{
  show: boolean;
  setShow: (v: boolean) => void;
} | null>(null);

export function BackgroundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [show, setShow] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === null ? true : raw === "1";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, show ? "1" : "0");
      // dispatch a custom event so other components in the same page can sync
      window.dispatchEvent(new CustomEvent("bgToggle", { detail: { show } }));
    } catch (e) {
      // ignore
    }
  }, [show]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setShow(e.newValue === null ? true : e.newValue === "1");
      }
    };

    const onCustom = (e: Event) => {
      // keep in sync if someone else dispatches
      const detail: any = (e as CustomEvent).detail;
      if (typeof detail?.show === "boolean") setShow(detail.show);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("bgToggle", onCustom as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("bgToggle", onCustom as EventListener);
    };
  }, []);

  return (
    <BackgroundContext.Provider value={{ show, setShow }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useShowBackgrounds() {
  const ctx = useContext(BackgroundContext);
  if (!ctx) {
    // allow fallback for components that aren't wrapped: read localStorage directly
    const get = () => {
      if (typeof window === "undefined") return true;
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw === null ? true : raw === "1";
    };

    const [show, setShow] = useState<boolean>(get);

    useEffect(() => {
      const onStorage = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY) {
          setShow(e.newValue === null ? true : e.newValue === "1");
        }
      };

      const onCustom = (e: Event) => {
        const detail: any = (e as CustomEvent).detail;
        if (typeof detail?.show === "boolean") setShow(detail.show);
      };

      window.addEventListener("storage", onStorage);
      window.addEventListener("bgToggle", onCustom as EventListener);

      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("bgToggle", onCustom as EventListener);
      };
    }, []);

    return { show, setShow } as const;
  }

  return ctx as { show: boolean; setShow: (v: boolean) => void };
}

export function BgToggleButton() {
  const { show, setShow } = useShowBackgrounds();

  return (
    <button
      onClick={() => setShow(!show)}
      className={`rounded-full border px-5 py-3 text-base font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-2 ${show ? "bg-red-600 border-red-700 text-white" : "bg-white border-gray-200 text-gray-800"}`}
      aria-pressed={show}
      aria-label={show ? "隐藏背景图片" : "显示背景图片"}
    >
      <span aria-hidden>🖼️</span>
      <span>背景: {show ? "开" : "关"}</span>
    </button>
  );
}

export default BgToggleButton;
