import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-4 py-10 text-center text-sm text-muted">
      © {new Date().getFullYear()} {site.owner} · Dibuat dengan ❤️ di {site.name}
    </footer>
  );
}
