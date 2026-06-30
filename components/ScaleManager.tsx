"use client";

import { useEffect } from "react";

const DESIGN_WIDTH = 390;

export function ScaleManager() {
  useEffect(() => {
    function update() {
      const scale = Math.min(1, window.innerWidth / DESIGN_WIDTH);
      document.documentElement.style.setProperty("--app-scale", String(scale));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return null;
}
