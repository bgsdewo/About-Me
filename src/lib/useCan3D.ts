"use client";
// Menentukan apakah perangkat cukup kuat untuk animasi 3D.
// Kalau tidak (WebGL tidak ada, RAM/CPU kecil, atau user minta "kurangi gerakan"), kita pakai versi 2D.
import { useEffect, useState } from "react";

export type Quality = "high" | "low" | "none";

export function useCan3D(): Quality | null {
  const [quality, setQuality] = useState<Quality | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    const nav = navigator as Navigator & { deviceMemory?: number };
    const weak = (nav.hardwareConcurrency ?? 4) <= 2 || (nav.deviceMemory ?? 4) <= 2;
    const mobile = window.matchMedia("(max-width: 768px)").matches;

    if (reduced || !gl || weak) setQuality("none");
    else setQuality(mobile ? "low" : "high");
  }, []);

  return quality;
}
