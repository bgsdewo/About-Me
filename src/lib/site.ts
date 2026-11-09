// Data dasar website. Nanti (tahap 3) nama & tagline diambil dari tabel `profile` di Supabase.
export const site = {
  name: "My Life Space",
  owner: "bgsdewo", // ← ganti dengan nama aslimu
  tagline: "Tempat aku menyimpan cerita, perjalanan, dan hal-hal kecil yang berarti.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const navLinks = [
  { href: "/#about", label: "Tentang" },
  { href: "/#achievements", label: "Pencapaian" },
  { href: "/#places", label: "Perjalanan" },
  { href: "/#journal", label: "Jurnal" },
  { href: "/#guestbook", label: "Buku Tamu" },
];
