export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-black/5 dark:border-white/10"
    >
      {/* Decorative gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent)]"
      />
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-600/20 bg-blue-600/10 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          15+ years in Information Technology &amp; IT Services
        </span>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Building reliable technology that moves businesses forward.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          I&apos;m <strong>Arun Mandook</strong> — an IT professional with over
          a decade and a half of experience delivering software, cloud
          infrastructure, and managed IT services for organisations of every
          size.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href="#contact"
            className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-7 text-base font-medium text-white transition-colors hover:bg-blue-700"
          >
            Start an enquiry
          </a>
          <a
            href="#services"
            className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 px-7 text-base font-medium transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            Explore services
          </a>
        </div>
      </div>
    </section>
  );
}
