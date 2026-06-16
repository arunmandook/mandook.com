const TIMELINE = [
  {
    period: "2009 – 2013",
    role: "Systems & Support Engineer",
    detail:
      "Began my career managing on-premise infrastructure, networks, and end-user support for mid-sized enterprises.",
  },
  {
    period: "2013 – 2018",
    role: "Software & Solutions Lead",
    detail:
      "Led development teams delivering custom business applications and integrations across web and enterprise platforms.",
  },
  {
    period: "2018 – 2022",
    role: "Cloud & DevOps Architect",
    detail:
      "Designed and migrated workloads to the cloud, introducing CI/CD, automation, and resilient, scalable architectures.",
  },
  {
    period: "2022 – Present",
    role: "IT Services Consultant",
    detail:
      "Partnering with organisations to plan, secure, and modernise their technology and managed IT services end to end.",
  },
];

const SKILLS = [
  "Cloud (AWS / Azure / GCP)",
  "DevOps & CI/CD",
  "Software Development",
  "Network & Infrastructure",
  "Cybersecurity",
  "Database & Data",
  "IT Strategy & Consulting",
  "Managed IT Services",
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        {/* Narrative + skills */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">About me</h2>
          <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Over the past <strong>15 years</strong> I&apos;ve worked across the
            full spectrum of information technology — from hands-on systems
            support to architecting cloud platforms and advising on IT strategy.
          </p>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            My focus is simple: deliver technology that is reliable, secure, and
            genuinely useful to the people and businesses that depend on it.
          </p>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Core expertise
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-black/10 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Timeline */}
        <div id="experience" className="scroll-mt-20">
          <h3 className="text-xl font-semibold">Career journey</h3>
          <ol className="mt-6 space-y-8 border-l border-black/10 pl-6 dark:border-white/15">
            {TIMELINE.map((item) => (
              <li key={item.period} className="relative">
                <span className="absolute -left-[1.625rem] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-600 dark:border-black" />
                <div className="text-sm font-medium text-blue-600">{item.period}</div>
                <div className="mt-0.5 font-semibold">{item.role}</div>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {item.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
