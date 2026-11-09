import Hero from "@/components/hero/Hero";
import SectionPlaceholder from "@/components/ui/SectionPlaceholder";

// Beranda. Bagian-bagian di bawah hero masih kerangka; diisi satu per satu di tahap berikutnya.
export default function Home() {
  return (
    <>
      <Hero />
      <SectionPlaceholder id="about" emoji="🙋" title="Tentang Aku" desc="Cerita singkat tentang siapa aku." />
      <SectionPlaceholder id="achievements" emoji="🏆" title="Pencapaian" desc="Hal-hal yang membuatku bangga." />
      <SectionPlaceholder id="places" emoji="🗺️" title="Perjalanan" desc="Tempat-tempat yang pernah aku kunjungi." />
      <SectionPlaceholder id="journal" emoji="📝" title="Jurnal" desc="Catatan dan cerita harianku." />
      <SectionPlaceholder id="guestbook" emoji="👋" title="Buku Tamu" desc="Tinggalkan sapaan untukku!" />
    </>
  );
}
