"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useCan3D } from "@/lib/useCan3D";
import { site } from "@/lib/site";
import HeroFallback from "./HeroFallback";

// Three.js hanya dimuat di browser & setelah halaman tampil → halaman tetap cepat.
const ParticleSphere = dynamic(() => import("./ParticleSphere"), { ssr: false });

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }),
};

export default function Hero() {
  const quality = useCan3D();
  const { resolvedTheme } = useTheme();

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4">
      {/* Latar: 3D atau fallback 2D */}
      <div className="absolute inset-0 -z-10">
        {quality === "high" || quality === "low" ? (
          <ParticleSphere quality={quality} light={resolvedTheme === "light"} />
        ) : quality === "none" ? (
          <HeroFallback />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--bg)_75%)]" />
      </div>

      <div className="pointer-events-none mx-auto max-w-3xl text-center">
        <motion.p custom={0} variants={fadeUp} initial="hidden" animate="show"
          className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-muted sm:text-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" /> Selamat datang di {site.name}
        </motion.p>
        <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="show"
          className="font-display text-4xl leading-tight font-bold sm:text-6xl md:text-7xl">
          Hai, aku <span className="text-gradient">{site.owner}</span>
        </motion.h1>
        <motion.p custom={2} variants={fadeUp} initial="hidden" animate="show"
          className="mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg">
          {site.tagline}
        </motion.p>
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show"
          className="pointer-events-auto mt-8 flex flex-wrap justify-center gap-3">
          <a href="#about" className="btn-primary">Kenali aku</a>
          <a href="#guestbook" className="btn-ghost">Tinggalkan sapaan 👋</a>
        </motion.div>
      </div>

      {/* Tombol scroll */}
      <motion.a href="#about" aria-label="Gulir ke bawah"
        initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1 }, y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
        className="glass absolute bottom-6 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full">
        <ChevronDown className="h-5 w-5" />
      </motion.a>
    </section>
  );
}
