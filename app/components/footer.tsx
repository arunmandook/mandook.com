export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-black/5 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:px-6">
        <p>© {year} Arun Mandook. All rights reserved.</p>
        <p>
          15+ years in IT &amp; IT Services ·{" "}
          <a href="mailto:arun.mandook@gmail.com" className="hover:text-blue-600">
            arun.mandook@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
