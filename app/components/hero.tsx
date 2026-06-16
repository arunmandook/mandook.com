import HeroIllustration from "@/app/components/hero-illustration";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-black/5 dark:border-white/10"
    >
      {/* Decorative gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(232,194,90,0.14),transparent)]"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-8">
        {/* Marketing copy */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold">
            <span className="h-2 w-2 rounded-full bg-gold" />
            15+ years in Information Technology &amp; IT Services
          </span>

          <h1 className="bg-gradient-to-br from-[#fff4d6] via-gold to-gold-deep bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Transform your business with AI-driven technology
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            I help organisations modernise, automate, and scale — combining 15
            years of IT expertise with practical AI and cloud solutions that
            deliver real results.
          </p>

          <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <a
              href="#contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gold px-7 text-base font-semibold text-black transition-colors hover:bg-gold-deep"
            >
              Book a free consultation
            </a>
            <a
              href="#services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 px-7 text-base font-medium transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              See services
            </a>
          </div>

          {/* Trust bar */}
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500 lg:justify-start dark:text-zinc-400">
            {[
              ["15+", "years experience"],
              ["120+", "projects delivered"],
              ["50+", "happy clients"],
              ["99.9%", "uptime"],
            ].map(([value, label]) => (
              <li key={label} className="flex items-center gap-1.5">
                <span className="font-semibold text-gold">{value}</span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Illustration */}
        <div className="flex justify-center lg:justify-end">
          <HeroIllustration className="w-full max-w-sm sm:max-w-md" />
        </div>
      </div>
    </section>
  );
}
