"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Navbar jadi "kaca" setelah halaman digulir sedikit
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <nav className={`mx-auto flex max-w-5xl items-center justify-between rounded-full px-3 py-2 transition-all ${open ? "glass-strong shadow-lg" : scrolled ? "glass shadow-lg" : ""}`}>
        <Link href="/" className="font-display px-2 text-lg font-bold" onClick={() => setOpen(false)}>
          <span className="text-gradient">✦</span> {site.name}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="rounded-full px-3 py-2 text-sm text-muted transition hover:text-[var(--fg)]">{l.label}</Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="glass grid h-11 w-11 place-items-center rounded-full md:hidden" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Menu HP */}
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass-strong mx-auto mt-2 flex max-w-5xl flex-col rounded-3xl p-2 shadow-2xl md:hidden">
            {navLinks.map((l, i) => (
              <motion.li key={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-base">{l.label}</Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
