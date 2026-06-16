const STATS = [
  { value: "15+", label: "Years of experience" },
  { value: "120+", label: "Projects delivered" },
  { value: "50+", label: "Happy clients" },
  { value: "99.9%", label: "Uptime maintained" },
];

export default function Stats() {
  return (
    <section className="border-b border-black/5 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-bold text-blue-600 sm:text-4xl">{s.value}</div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
