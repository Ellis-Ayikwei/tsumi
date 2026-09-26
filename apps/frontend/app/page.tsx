import Link from "next/link";
import type { CSSProperties } from "react";

import { HomeErrandForm } from "@/components/home-errand-form";
import { ThemeToggle } from "@/components/theme-toggle";

import styles from "./home.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Example errand shown in the hero ticket. Fee split follows the platform rule:
// 15% of the price, floored, and the runner gets the rest (4500 -> 675 + 3825).
const EXAMPLE = {
  title: "Buy medicine at the pharmacy",
  route: "Osu to Airport Residential",
  price: "GHS 45.00",
  runnerGets: "GHS 38.25",
  fee: "GHS 6.75",
};

const TICKET_STEPS: { label: string; state: "done" | "now" | "next"; at: string }[] = [
  { label: `Posted. ${EXAMPLE.price} moved to TsumiSafe`, state: "done", at: "0.3s" },
  { label: "Runner accepted", state: "done", at: "1.2s" },
  { label: "On the way", state: "now", at: "1.6s" },
  { label: "You confirm, runner is paid", state: "next", at: "0s" },
];

const HOW = [
  {
    title: "You post the errand",
    body: "Say what you need and where, set your price and pay. The money moves into TsumiSafe, not to the runner.",
  },
  {
    title: "A verified runner accepts",
    body: "Only runners whose ID our team has reviewed can see and accept errands. You see who is coming before they arrive.",
  },
  {
    title: "They get it done",
    body: "Follow each stage in the app, and call your runner directly while the errand is active.",
  },
  {
    title: "You confirm, they get paid",
    body: `The runner receives your price minus Tsumi's 15% fee. On a ${EXAMPLE.price} errand, that is ${EXAMPLE.runnerGets} to the runner.`,
  },
];

const ERRANDS = [
  { name: "Deliveries", examples: "Parcels, documents, food, the charger you left at the office." },
  { name: "Pickups", examples: "A repaired laptop, an order from your tailor, a parcel from the post office." },
  { name: "Shopping", examples: "Groceries from Makola, medicine, a gas refill." },
  { name: "Anything else", examples: "Queue at an office, pay a bill, drop off your laundry." },
];

const RUNNER_POINTS = [
  "Keep 85% of every errand price. You see exactly what you'll earn before you accept.",
  "Withdraw your earnings to your mobile money number.",
  "Take up to three errands at a time and choose the ones that fit your route.",
  "Get verified once: upload your ID and a selfie, and our team reviews them.",
];

const QUESTIONS = [
  {
    q: "Who holds my money?",
    a: "TsumiSafe, Tsumi's escrow. Your payment stays there from the moment you post until you confirm the errand is done, cancel it, or support settles a reported problem.",
  },
  {
    q: "What does it cost?",
    a: "You set the price of each errand. Tsumi's 15% fee comes out of that price, so you pay exactly what you set and nothing more.",
  },
  {
    q: "How are runners checked?",
    a: "Every runner uploads a government ID and a selfie, and our team reviews both before they can accept errands.",
  },
  {
    q: "What if the errand isn't done properly?",
    a: "Don't confirm it. Report a problem from the errand screen and the money stays held while support reviews it. If you cancel before the runner starts, the full amount returns to your Tsumi wallet.",
  },
  {
    q: "How do I pay?",
    a: "Top up your Tsumi wallet with mobile money or card through Paystack, then pay for errands from your wallet in Ghana cedis.",
  },
];

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/trust", label: "Trust and safety" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tsumi",
  url: siteUrl,
  logo: "/favicon.ico",
  description: "Errands and deliveries in Ghana by ID-checked runners. Payment is held in escrow until the customer confirms.",
  address: { "@type": "PostalAddress", addressLocality: "Accra", addressCountry: "GH" },
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: "support@tsumi.gh" },
};

// Size classes stay out of the shared colour classes so no two heights compete.
const brandButton =
  "inline-flex items-center justify-center rounded-xl bg-[var(--brand)] font-semibold text-[var(--brand-fg)] transition-colors hover:bg-[var(--brand-ink)]";
const primaryButton = `${brandButton} h-12 px-6`;

export default function Home() {
  return (
    <div className={`${styles.page} min-h-screen`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className={`${styles.header} sticky top-0 z-40 border-b border-[var(--line)] backdrop-blur-md`}>
        <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
          <Link href="/" className="flex min-h-11 items-center text-2xl font-bold tracking-tight">
            Tsumi
          </Link>
          <div className="hidden items-center gap-2 text-[15px] text-[var(--muted)] md:flex">
            <a href="#how-it-works" className="flex min-h-11 items-center px-3 hover:text-[var(--ink)]">How it works</a>
            <a href="#runners" className="flex min-h-11 items-center px-3 hover:text-[var(--ink)]">Become a runner</a>
            <a href="#questions" className="flex min-h-11 items-center px-3 hover:text-[var(--ink)]">Questions</a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/auth/login" className="flex h-11 items-center rounded-lg px-3 text-[15px] font-medium hover:bg-black/5">
              Sign in
            </Link>
            <Link href="/request-errand" className={`${brandButton} h-11 px-4 text-[15px]`}>
              Post an errand
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <div className={styles.hero}>
        <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-14 md:pt-20 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-7">
            <h1 className={`${styles.display} text-balance`}>
              Send someone. Pay when it&apos;s done.
            </h1>
            <p className={`${styles.body} mt-5 max-w-[34rem] text-[var(--muted)]`}>
              Tsumi runners pick up, shop, queue and deliver for you across Ghana. Your payment waits with TsumiSafe,
              and the runner is paid only after you confirm the job is done.
            </p>
            <HomeErrandForm />
            <p className={`${styles.caption} mt-4 text-[var(--muted)]`}>
              You set the price on the next step. Pay with mobile money or card through Paystack.
            </p>
          </div>

          <figure className="lg:col-span-5" aria-label="Example errand showing where the money is held">
            <div className={`${styles.ticket} p-6`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{EXAMPLE.title}</p>
                  <p className="mt-0.5 text-sm text-[var(--muted)]">{EXAMPLE.route}</p>
                </div>
                <p className={`${styles.money} whitespace-nowrap text-lg font-bold`}>{EXAMPLE.price}</p>
              </div>

              <div className="mt-8">
                <div className={styles.track} aria-hidden>
                  <div className={styles.trackFill} />
                  <span className={styles.node} style={{ left: "0%" }} />
                  <span className={`${styles.node} ${styles.nodeHeld}`} style={{ left: "50%" }} />
                  <span className={styles.node} style={{ left: "100%" }} />
                  <span className={`${styles.chip} ${styles.money}`}>{EXAMPLE.price}</span>
                </div>
                <div className="mt-5 grid grid-cols-3 text-sm">
                  <span>You</span>
                  <span className="text-center font-semibold">TsumiSafe</span>
                  <span className="text-right text-[var(--muted)]">Runner</span>
                </div>
                <p className="mt-2 text-center text-sm text-[var(--muted)]">Held until you confirm.</p>
              </div>

              <ol className="mt-6 space-y-3 border-t border-[var(--line)] pt-5 text-[15px]">
                {TICKET_STEPS.map((s) => (
                  <li
                    key={s.label}
                    className={`flex items-center gap-3 ${s.state === "next" ? "text-[var(--muted)]" : styles.step}`}
                    style={{ "--at": s.at } as CSSProperties}
                  >
                    <span
                      aria-hidden
                      className={`h-3 w-3 shrink-0 rounded-full border-2 ${
                        s.state === "done"
                          ? `${styles.stepDot} border-[var(--brand)] bg-[var(--brand)]`
                          : s.state === "now"
                            ? `${styles.stepDot} border-[var(--brand)] bg-[var(--card)]`
                            : "border-[var(--line)] bg-[var(--card)]"
                      }`}
                    />
                    <span className={s.state === "now" ? "font-semibold" : undefined}>{s.label}</span>
                  </li>
                ))}
              </ol>

              <dl className={`${styles.money} mt-5 grid grid-cols-2 gap-y-1 rounded-xl bg-[var(--field)] px-4 py-3 text-sm`}>
                <dt className="text-[var(--muted)]">Runner receives</dt>
                <dd className="text-right font-medium">{EXAMPLE.runnerGets}</dd>
                <dt className="text-[var(--muted)]">Tsumi fee (15%)</dt>
                <dd className="text-right font-medium">{EXAMPLE.fee}</dd>
              </dl>
            </div>
          </figure>
        </section>
        </div>

        <section id="how-it-works" className="border-t border-[var(--line)] bg-[var(--surface)]">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className={styles.title}>Where your money is at every step</h2>
              <div className="mt-8 border-l-2 border-[var(--ink)] pl-5">
                <p className="font-semibold">If something goes wrong</p>
                <p className="mt-2 leading-relaxed text-[var(--muted)]">
                  Report a problem before you confirm and the money stays held while Tsumi support reviews it. Cancel
                  before the runner starts and the full amount returns to your wallet.
                </p>
              </div>
            </div>
            <ol className="divide-y divide-[var(--line)] border-y border-[var(--line)] lg:col-span-7 lg:col-start-6">
              {HOW.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-2 py-7">
                  <span className={`${styles.title} ${styles.money} text-[var(--brand)]`} aria-hidden>
                    {i + 1}
                  </span>
                  <div>
                    <h3 className={styles.headline}>{step.title}</h3>
                    <p className={`${styles.body} mt-1.5 max-w-[36rem] text-[var(--muted)]`}>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20">
          <h2 className={`${styles.title} max-w-xl`}>What people send runners for</h2>
          <dl className="mt-10 grid gap-x-12 sm:grid-cols-2">
            {ERRANDS.map((e) => (
              <div key={e.name} className="border-t border-[var(--line)] py-6">
                <dt className={styles.headline}>{e.name}</dt>
                <dd className={`${styles.body} mt-1.5 text-[var(--muted)]`}>{e.examples}</dd>
              </div>
            ))}
          </dl>
          <Link href="/request-errand" className={`${primaryButton} mt-8`}>
            Post an errand
          </Link>
        </section>

        <section id="runners" className="bg-[var(--band)] text-[var(--band-fg)]">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className={styles.title}>Run errands on your own time</h2>
              <p className={`${styles.body} mt-5 max-w-md opacity-70`}>
                Know your city and want flexible work? Pick up errands near you and get paid when each one is done.
              </p>
              <Link
                href="/become-a-runner"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-[var(--band-fg)] px-6 font-semibold text-[var(--band)] transition-opacity hover:opacity-90"
              >
                Become a runner
              </Link>
            </div>
            <ul className="divide-y divide-white/15 border-y border-white/15 lg:col-span-6 lg:col-start-7">
              {RUNNER_POINTS.map((point) => (
                <li key={point} className={`${styles.body} py-5 opacity-85`}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="questions" className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-12">
          <h2 className={`${styles.title} lg:col-span-4`}>Before your first errand</h2>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)] lg:col-span-7 lg:col-start-6">
            {QUESTIONS.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className={`${styles.headline} flex min-h-11 cursor-pointer list-none items-center justify-between gap-4`}>
                  {q}
                  <span aria-hidden className="text-2xl font-normal text-[var(--muted)] group-open:rotate-45 motion-safe:transition-transform">
                    +
                  </span>
                </summary>
                <p className={`${styles.body} mt-3 max-w-[38rem] text-[var(--muted)]`}>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:justify-between">
          <div>
            <p className="text-2xl font-bold tracking-tight">Tsumi</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
              Errands and deliveries in Ghana, paid through escrow.
            </p>
            <a href="mailto:support@tsumi.gh" className="mt-2 flex min-h-11 items-center text-sm font-medium underline-offset-4 hover:underline">
              support@tsumi.gh
            </a>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 text-sm sm:grid-cols-3">
            {FOOTER_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="flex min-h-11 items-center text-[var(--muted)] hover:text-[var(--ink)]">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mx-auto max-w-6xl px-5 pb-8 text-xs text-[var(--muted)]">
          &copy; {new Date().getFullYear()} Tsumi. Payments are processed by Paystack.
        </p>
      </footer>
    </div>
  );
}
