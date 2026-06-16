import Navbar from "@/app/components/navbar";
import Hero from "@/app/components/hero";
import Stats from "@/app/components/stats";
import About from "@/app/components/about";
import Services from "@/app/components/services";
import EnquiryForm from "@/app/components/enquiry-form";
import Footer from "@/app/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <About />
        <Services />

        {/* Contact / Enquiry */}
        <section id="contact" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gold sm:text-4xl">
                Let&apos;s work together
              </h2>
              <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                Have a project, a question, or need IT support? Send an enquiry
                and I&apos;ll get back to you shortly.
              </p>

              <dl className="mt-8 space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📧</span>
                  <div>
                    <dt className="font-medium">Email</dt>
                    <dd className="text-zinc-600 dark:text-zinc-400">
                      <a href="mailto:arun.mandook@gmail.com" className="hover:text-gold">
                        arun.mandook@gmail.com
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚡</span>
                  <div>
                    <dt className="font-medium">Response time</dt>
                    <dd className="text-zinc-600 dark:text-zinc-400">
                      Usually within 1 business day
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-zinc-900">
              <EnquiryForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
