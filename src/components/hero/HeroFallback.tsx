// Versi 2D (tanpa WebGL) untuk perangkat lemah atau "reduce motion": orb gradien dari CSS.
export default function HeroFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      <div className="orb h-64 w-64 rounded-full sm:h-96 sm:w-96" />
    </div>
  );
}
