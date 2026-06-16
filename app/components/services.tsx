const SERVICES = [
  {
    icon: "☁️",
    title: "Cloud & Infrastructure",
    detail:
      "Cloud migration, architecture, and infrastructure management on AWS, Azure, and GCP — built to scale.",
  },
  {
    icon: "💻",
    title: "Software Development",
    detail:
      "Custom web and business applications, APIs, and integrations engineered for performance and maintainability.",
  },
  {
    icon: "🔁",
    title: "DevOps & Automation",
    detail:
      "CI/CD pipelines, infrastructure-as-code, and automation that ship faster with fewer errors.",
  },
  {
    icon: "🔒",
    title: "Cybersecurity",
    detail:
      "Security assessments, hardening, and best-practice controls to protect your data and systems.",
  },
  {
    icon: "🛠️",
    title: "Managed IT Services",
    detail:
      "Proactive monitoring, support, and maintenance that keep your technology running around the clock.",
  },
  {
    icon: "📈",
    title: "IT Strategy & Consulting",
    detail:
      "Technology roadmaps and advisory aligning your IT investment with real business outcomes.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="border-y border-black/5 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Services I offer
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            End-to-end IT services drawing on 15 years of hands-on experience —
            from strategy and build to ongoing support.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
            >
              <div className="text-3xl">{s.icon}</div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
