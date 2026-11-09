# 🗺️ Rencana — My Life Space

Dokumen ini adalah "peta" proyek: struktur folder, skema database, daftar halaman, dan tahapan pembangunan.

## 1. Tech stack

| Bagian | Pilihan | Kenapa |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | Halaman cepat, SEO bagus, gampang deploy ke Vercel |
| Styling | Tailwind CSS v4 | Tulis gaya langsung di className, mobile-first |
| Animasi | Framer Motion | Scroll-reveal, transisi, micro-interaction |
| 3D | React Three Fiber + drei (Three.js) | Bola partikel interaktif di hero |
| Peta | Leaflet + react-leaflet | Gratis, tidak perlu API key |
| Backend | Supabase (Postgres + Auth + Storage) | Database, login, dan upload file dalam satu tempat |
| Deploy | Vercel | Gratis untuk proyek pribadi |

**Desain:** dark futuristik + glassmorphism. Palet: navy gelap `#070B1A`, violet `#8B5CF6`, cyan `#22D3EE`, aksen pink `#F472B6`. Font: Space Grotesk (judul) + Inter (teks). Ada mode terang.

## 2. Struktur folder

```
about-me/
├─ docs/PLAN.md                 ← dokumen ini
├─ supabase/schema.sql          ← jalankan sekali di Supabase SQL Editor
├─ public/                      ← ikon PWA, gambar statis
├─ src/
│  ├─ app/                      ← setiap folder = satu URL
│  │  ├─ layout.tsx             ← kerangka semua halaman (font, tema, navbar)
│  │  ├─ page.tsx               ← "/"  beranda (hero + ringkasan semua bagian)
│  │  ├─ manifest.ts            ← PWA manifest
│  │  ├─ about/                 ← "/about"
│  │  ├─ achievements/          ← "/achievements"
│  │  ├─ places/                ← "/places" (peta) & places/[slug] (detail + galeri + video)
│  │  ├─ journal/               ← "/journal" & journal/[slug]
│  │  ├─ guestbook/             ← "/guestbook" (form + wall)
│  │  ├─ login/                 ← "/login"
│  │  ├─ admin/                 ← "/admin/*" dashboard (dilindungi login)
│  │  └─ api/guestbook/route.ts ← endpoint kirim sapaan (rate limit + honeypot)
│  ├─ components/
│  │  ├─ hero/                  ← bola partikel 3D + fallback 2D
│  │  ├─ layout/                ← Navbar, Footer, ThemeToggle
│  │  ├─ ui/                    ← tombol, kartu, skeleton, Reveal (scroll animation)
│  │  ├─ places/ achievements/ journal/ guestbook/ admin/
│  ├─ lib/
│  │  ├─ supabase/              ← client untuk browser & server
│  │  └─ types.ts               ← tipe data TypeScript
│  └─ middleware.ts             ← menjaga /admin hanya untuk pemilik
└─ .env.example                 ← contoh variabel rahasia (API key)
```

## 3. Skema database (Supabase / Postgres)

Lengkapnya ada di [`supabase/schema.sql`](../supabase/schema.sql).

| Tabel | Isi | Kolom utama |
|---|---|---|
| `profile` | 1 baris: data diriku | name, tagline, bio, avatar_url, skills[], interests[], socials (json) |
| `timeline` | Momen hidup | year, title, description, sort_order |
| `achievements` | Pencapaian | title, date, description, image_url, category, highlight |
| `places` | Tempat yang dikunjungi | name, slug, country, lat, lng, visited_at, story, cover_url |
| `place_media` | Foto/video sebuah tempat | place_id → places, type ('image'/'video'), url, caption, sort_order |
| `journal_entries` | Jurnal/tulisan | title, slug, content (markdown), tags[], published, created_at |
| `guestbook` | Sapaan pengunjung | name, message, emoji, status ('unread'/'read'/'hidden'), ip_hash |

**Keamanan (Row Level Security):**
- Semua orang boleh **membaca** konten publik (jurnal hanya yang `published`, buku tamu hanya yang bukan `hidden`).
- Hanya **admin** (email kamu, dicatat di tabel `admins`) yang boleh menambah/mengubah/menghapus.
- Sapaan baru masuk lewat API server (dengan rate limit), bukan langsung dari browser.

**Storage buckets:** `images` (foto) dan `videos` (video) — publik untuk dibaca, hanya admin yang boleh upload.

## 4. Daftar halaman

| URL | Untuk siapa | Isi |
|---|---|---|
| `/` | Publik | Hero 3D, cuplikan About, Achievements, Places, Journal, Guestbook |
| `/about` | Publik | Cerita, foto, skill, minat, timeline hidup |
| `/achievements` | Publik | Kartu tilt 3D + counter angka |
| `/places` | Publik | Peta interaktif + daftar tempat |
| `/places/[slug]` | Publik | Cerita, galeri foto, video player |
| `/journal`, `/journal/[slug]` | Publik | Daftar & isi tulisan, filter tag |
| `/guestbook` | Publik | Form sapaan + wall |
| `/login` | Pemilik | Login email + password / magic link |
| `/admin` | Pemilik | Ringkasan + badge sapaan baru |
| `/admin/profile`, `/admin/achievements`, `/admin/places`, `/admin/journal`, `/admin/guestbook` | Pemilik | CRUD + upload dengan progress bar |

## 5. Tahapan pembangunan

1. ✅ **Setup + Hero** — Next.js, Tailwind, tema gelap/terang, navbar, bola partikel 3D + fallback 2D, manifest PWA, skema database.
2. ⏳ **Supabase + Auth + Admin dasar** — login, middleware, layout dashboard.
3. ⏳ **About** (+ CRUD profil & timeline)
4. ⏳ **Achievements** (+ CRUD, upload gambar)
5. ⏳ **Places** (peta Leaflet, galeri, upload video + progress bar)
6. ⏳ **Journal** (editor markdown, tag)
7. ⏳ **Guestbook** (form publik, rate limit, honeypot, wall, kelola di admin)
8. ⏳ **Polish** — service worker PWA, SEO/OG image, skeleton, aksesibilitas, deploy Vercel.
