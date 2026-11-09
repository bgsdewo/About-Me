import Reveal from "./Reveal";

// Kerangka sementara untuk bagian yang akan dibangun di tahap berikutnya.
export default function SectionPlaceholder({ id, emoji, title, desc }: { id: string; emoji: string; title: string; desc: string }) {
  return (
    <section id={id} className="mx-auto max-w-5xl scroll-mt-24 px-4 py-20 sm:py-28">
      <Reveal>
        <p className="text-sm font-semibold tracking-widest text-[var(--cyan)] uppercase">{emoji} {title}</p>
        <h2 className="font-display mt-2 text-3xl font-bold sm:text-4xl">{desc}</h2>
      </Reveal>
      <Reveal delay={0.1} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass h-40 animate-pulse rounded-3xl" />
        ))}
      </Reveal>
    </section>
  );
}
