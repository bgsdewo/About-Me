# ✦ My Life Space

Ruang digital pribadi: profil, pencapaian, perjalanan (foto & video), jurnal, dan buku tamu.
Dibangun dengan **Next.js + TypeScript + Tailwind + Framer Motion + React Three Fiber + Supabase**.

📄 Rencana lengkap (struktur folder, skema database, daftar halaman): [`docs/PLAN.md`](docs/PLAN.md)

## 🚀 Menjalankan di komputer

Butuh **Node.js 20+** ([download](https://nodejs.org)).

```bash
npm install          # pasang semua library (sekali saja)
cp .env.example .env.local   # buat file rahasia, lalu isi nilainya (lihat di bawah)
npm run dev          # jalankan → buka http://localhost:3000
```

Buka di HP (satu Wi-Fi dengan laptop): `npm run dev -- -H 0.0.0.0` lalu buka `http://IP-LAPTOP:3000`.

## 🔑 Yang perlu kamu isi

1. Buat proyek gratis di [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → tempel isi [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. **Project Settings → API** → salin `Project URL`, `anon key`, dan `service_role key` ke `.env.local`.
4. Ganti nama & tagline di [`src/lib/site.ts`](src/lib/site.ts).

> Tahap 1 (hero) sudah bisa jalan **tanpa** Supabase. Supabase dipakai mulai tahap 2.

## 🧭 Progres

- [x] Tahap 1 — Setup, tema gelap/terang, navbar, hero 3D + fallback 2D, manifest PWA, skema DB
- [ ] Tahap 2 — Supabase Auth + dashboard admin
- [ ] Tahap 3 — About
- [ ] Tahap 4 — Achievements
- [ ] Tahap 5 — Places (peta, galeri, video)
- [ ] Tahap 6 — Journal
- [ ] Tahap 7 — Guestbook
- [ ] Tahap 8 — Polish & deploy ke Vercel
