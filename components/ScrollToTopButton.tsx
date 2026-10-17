"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const VISIBILITY_OFFSET = 320;

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      setIsVisible(window.scrollY > VISIBILITY_OFFSET);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateVisibility);
    };
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      aria-label="Повернутися вгору"
      onClick={handleClick}
      className={`focus-ring fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] right-4 z-[55] inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(12,14,22,0.88)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.4)] backdrop-blur-[20px] transition-all duration-200 hover:bg-[rgba(18,20,31,0.96)] lg:bottom-6 lg:right-6 ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="size-4" aria-hidden="true" />
      До початку
    </button>
  );
}
