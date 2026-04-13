"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { AshokaChakra } from "@/components/ashoka-chakra";
import { cn } from "@/lib/utils";

const HERO_BG =
  "https://kimi-web-img.moonshot.cn/img/l450v.alamy.com/fc73b2f94d7ac0fb6d1c4d8d29a0964241ac4225.jpg";

const modules = [
  { icon: "⚖️", name: "LEX", desc: "AI Legal Assistant. Ask any question about Indian law.", live: true },
  { icon: "💰", name: "Taxation", desc: "Full tax transparency, auto-filing, zero leakage.", live: false },
  { icon: "🏛", name: "Judiciary", desc: "Case tracking, AI scheduling, priority queue.", live: false },
  { icon: "📋", name: "RTI & Complaints", desc: "File and track in 60 seconds. No red tape.", live: false },
  { icon: "🏗", name: "Public Works", desc: "Every tender, every contractor, on-chain verification.", live: false },
  { icon: "📄", name: "Govt Contracts", desc: "Open bidding, algorithmic evaluation, zero corruption.", live: false },
  { icon: "🔒", name: "Law & Order", desc: "FIR filing, case status, AI dispatch optimization.", live: false },
  { icon: "🗳", name: "Public Voting", desc: "Tamper-proof, blockchain-verified, instant results.", live: false },
];

export function LandingPage() {
  const howSectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = howSectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            progressRef.current?.style.setProperty("width", "100%");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const kind = el.dataset.statKind;

          if (kind === "billions") {
            const target = 1.4;
            const duration = 2000;
            let start: number | null = null;
            const tick = (now: number) => {
              if (start === null) start = now;
              const t = Math.min((now - start) / duration, 1);
              const current = t * target;
              el.textContent = current >= target ? `${target.toFixed(1)}B` : `${current.toFixed(1)}`;
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          } else if (kind === "zero") {
            el.textContent = "0";
          } else if (kind === "percent") {
            const target = 100;
            const duration = 2000;
            let start: number | null = null;
            const tick = (now: number) => {
              if (start === null) start = now;
              const t = Math.min((now - start) / duration, 1);
              const current = Math.floor(t * target);
              el.textContent = t >= 1 ? `${target}%` : `${current}`;
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }

          statsObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-stat]").forEach((el) => statsObserver.observe(el));

    return () => statsObserver.disconnect();
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="ap-noise relative min-h-screen overflow-x-hidden bg-ap-bg font-sans text-cream leading-relaxed">
      {/* Navigation */}
      <nav className="fixed top-0 z-[100] flex w-full items-center justify-between bg-gradient-to-b from-[rgba(5,8,16,0.9)] to-transparent px-8 py-8 md:px-16">
        <Link href="/" className="flex items-center gap-4">
          <AshokaChakra size="md" />
          <span className="font-serif text-2xl font-semibold tracking-tight text-cream">Abstract Party</span>
        </Link>
        <ul className="hidden list-none gap-12 md:flex">
          {[
            { href: "#vision", label: "Vision" },
            { href: "#modules", label: "Modules" },
            { href: "#how", label: "How It Works" },
            { href: "#join", label: "Join" },
          ].map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="relative text-sm font-medium text-cream/80 transition-opacity hover:text-cream hover:opacity-100 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-saffron after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <Link
          href="/chat"
          className="rounded-full border border-cream/30 px-4 py-2 text-sm font-medium text-cream transition-colors hover:border-cream hover:bg-cream/5"
        >
          Open LEX
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative flex h-screen items-center justify-center overflow-hidden" id="vision">
        <div
          className="absolute inset-0 scale-110 opacity-50"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(5,8,16,0.8) 0%, rgba(5,8,16,0.95) 100%), url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(100%) brightness(0.3) contrast(1.1)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 153, 51, 0.02) 2px, rgba(255, 153, 51, 0.02) 4px)",
          }}
        />
        <div className="relative z-10 max-w-[900px] animate-ap-fade-in-up px-8 text-center opacity-0 [animation-fill-mode:forwards]">
          <span className="mb-6 block text-sm font-bold uppercase tracking-[0.3em] text-saffron">
            India. Reimagined.
          </span>
          <h1 className="mb-6 font-serif text-[clamp(3rem,8vw,6rem)] font-bold leading-[0.95] text-cream [text-shadow:0_4px_20px_rgba(0,0,0,0.5)]">
            The Government
            <br />
            Has No Face.
          </h1>
          <p className="mx-auto mb-10 max-w-[560px] text-lg text-ap-muted leading-relaxed">
            Abstract Party is an open-source AI system that replaces corrupt human governance with
            transparent, code-driven administration. No politicians. No middlemen. Just law, logic,
            and accountability.
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <a
              href="#modules"
              className="inline-block rounded-full bg-saffron px-8 py-4 text-sm font-semibold text-ap-bg shadow-[0_0_20px_rgba(255,153,51,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,153,51,0.5)]"
            >
              Explore the System
            </a>
            <a
              href="#manifesto"
              className="inline-block rounded-full border border-cream/30 bg-transparent px-8 py-4 text-sm font-semibold text-cream transition-all hover:border-cream hover:bg-cream/5"
            >
              Read the Manifesto
            </a>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-ap-muted">
            <span className="h-2 w-2 animate-ap-pulse-dot rounded-full bg-[#22c55e]" />
            <span>Phase 1 Live — Legal AI Assistant (LEX)</span>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-50">
          <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
          <div className="h-[60px] w-px animate-ap-scroll bg-gradient-to-b from-cream to-transparent" />
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-saffron bg-ap-bg-secondary px-8 py-16">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <span
              data-stat
              data-stat-kind="billions"
              className="font-serif text-6xl font-bold leading-none text-saffron"
            >
              0
            </span>
            <div className="mt-2 text-xs uppercase tracking-widest text-ap-muted">Citizens to serve</div>
          </div>
          <div className="relative">
            <span
              data-stat
              data-stat-kind="zero"
              className="font-serif text-6xl font-bold leading-none text-saffron"
            >
              0
            </span>
            <div className="mt-2 text-xs uppercase tracking-widest text-ap-muted">Human administrators</div>
          </div>
          <div className="relative">
            <span
              data-stat
              data-stat-kind="percent"
              className="font-serif text-6xl font-bold leading-none text-saffron"
            >
              0
            </span>
            <div className="mt-2 text-xs uppercase tracking-widest text-ap-muted">Transparent by default</div>
          </div>
          <div className="relative">
            <span className="font-serif text-6xl font-bold leading-none text-saffron">∞</span>
            <div className="mt-2 text-xs uppercase tracking-widest text-ap-muted">Decisions logged</div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-ap-bg px-8 py-24">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 font-serif text-[clamp(2rem,5vw,3.5rem)] text-cream">The System Is Broken.</h2>
          <p className="text-lg text-ap-muted">Not because of bad laws. Because of bad actors.</p>
        </div>
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              icon: "🏛",
              title: "Opacity",
              body: "Contracts signed in closed rooms. Citizens never know where the money goes. Decisions made in darkness breed corruption.",
            },
            {
              icon: "⚖️",
              title: "Delay",
              body: "Average court case in India takes 10–15 years. Justice delayed is justice denied. The system moves at the speed of bureaucracy, not urgency.",
            },
            {
              icon: "💸",
              title: "Corruption",
              body: "₹92,000 crore lost to corruption annually. Every rupee traceable, none accountable. Human discretion is the loophole.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="animate-on-scroll relative overflow-hidden rounded border border-white/5 bg-ap-glass p-10 opacity-0 backdrop-blur-md transition-all duration-700 ease-out translate-y-8 before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:origin-left before:scale-x-0 before:bg-saffron before:transition-transform before:duration-300 before:content-[''] hover:-translate-y-1 hover:bg-white/[0.06] hover:before:scale-x-100 [&.visible]:translate-y-0 [&.visible]:opacity-100"
            >
              <div className="mb-4 text-3xl">{card.icon}</div>
              <h3 className="mb-3 font-serif text-2xl text-cream">{card.title}</h3>
              <p className="text-sm leading-relaxed text-ap-muted">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="bg-ap-bg-secondary px-8 py-24" id="modules">
        <div className="mx-auto mb-16 text-center">
          <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] text-cream">
            One Platform. Every Function of Government.
          </h2>
        </div>
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <div
              key={m.name}
              className={cn(
                "animate-on-scroll rounded border border-white/5 bg-ap-glass p-8 opacity-0 transition-all duration-700 ease-out translate-y-8 hover:-translate-y-1 hover:border-saffron/30 hover:shadow-[0_10px_40px_rgba(255,153,51,0.1)] [&.visible]:translate-y-0 [&.visible]:opacity-100",
                m.live && "cursor-pointer"
              )}
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="text-3xl">{m.icon}</span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                    m.live ? "bg-[rgba(34,197,94,0.1)] text-[#22c55e]" : "bg-ap-muted/10 text-ap-muted"
                  )}
                >
                  {m.live ? "Phase 1 — Live" : "Coming Soon"}
                </span>
              </div>
              {m.live ? (
                <Link href="/chat">
                  <h4 className="mb-2 font-sans text-xl font-bold text-cream hover:text-saffron">{m.name}</h4>
                </Link>
              ) : (
                <h4 className="mb-2 font-sans text-xl font-bold text-cream">{m.name}</h4>
              )}
              <p className="text-sm text-ap-muted">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ap-bg px-8 py-24" id="how" ref={howSectionRef}>
        <div className="mx-auto mb-16 text-center">
          <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] text-cream">
            Governed by Code. Audited by Everyone.
          </h2>
        </div>
        <div className="relative mx-auto max-w-[1000px] px-4 py-8">
          <div className="absolute left-0 right-0 top-1/2 hidden h-0.5 -translate-y-1/2 bg-saffron/20 md:block">
            <div
              ref={progressRef}
              className="relative h-full w-0 bg-saffron transition-[width] duration-[2s] ease-out"
            >
              <span className="absolute -right-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-saffron shadow-[0_0_20px_#ff9933]" />
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
            {[
              { n: "1", title: "Citizen Query", body: "You ask a question or file a request" },
              { n: "2", title: "AI Processes", body: "LEX handles it using verified law" },
              { n: "3", title: "Decision Logged", body: "Every action hashed and stored immutably" },
              { n: "4", title: "Public Audit", body: "Anyone can verify any decision, any time" },
            ].map((step) => (
              <div
                key={step.n}
                className="animate-on-scroll text-center opacity-0 transition-all duration-700 ease-out translate-y-5 [&.visible]:translate-y-0 [&.visible]:opacity-100"
              >
                <div className="mx-auto mb-4 flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-saffron bg-ap-bg font-serif text-xl font-bold text-saffron">
                  {step.n}
                </div>
                <h4 className="mb-2 text-lg text-cream">{step.title}</h4>
                <p className="text-sm text-ap-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEX Demo */}
      <section className="bg-ap-bg-secondary px-8 pb-24 pt-24">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 font-serif text-[clamp(2rem,5vw,3.5rem)] text-cream">Meet LEX — Your Constitutional AI</h2>
          <p className="text-lg text-ap-muted">
            Ask anything about Indian law. Get answers grounded in the Constitution, IPC, CrPC, and RTI.
          </p>
        </div>
        <div className="mx-auto max-w-[800px] overflow-hidden rounded-xl border border-white/10 bg-black/40">
          <div className="flex min-h-[400px] flex-col gap-6 p-8">
            <div className="max-w-[80%] self-end rounded-[20px_20px_4px_20px] bg-saffron px-6 py-4 text-sm font-medium text-ap-bg">
              What are my Fundamental Rights as an Indian citizen?
            </div>
            <div className="max-w-[80%] self-start rounded-[4px_20px_20px_20px] border border-white/10 bg-ap-glass p-6 text-cream leading-relaxed">
              Under Part III of the Constitution (Articles 12–35), you are guaranteed 6 Fundamental Rights
              including Right to Equality (Art. 14), Right to Freedom (Art. 19), and Right to Life (Art.
              21). These rights are justiciable and enforceable by the Supreme Court and High Courts.
              <br />
              <span className="mt-3 inline-block rounded-full border border-indigoBlue bg-indigoBlue/20 px-3 py-1 text-xs font-semibold text-indigoBlue">
                Constitution of India · Article 14–21
              </span>
            </div>
            <div className="max-w-[80%] self-end rounded-[20px_20px_4px_20px] bg-saffron px-6 py-4 text-sm font-medium text-ap-bg">
              How do I file an RTI application?
            </div>
            <div className="max-w-[80%] self-start rounded-[4px_20px_20px_20px] border border-white/10 bg-ap-glass p-6 text-cream leading-relaxed">
              Under the Right to Information Act, 2005, you can file an RTI by writing to the Public
              Information Officer (PIO) of the concerned department. No form is required, but a fee of ₹10
              is applicable. The PIO must respond within 30 days (48 hours for life/liberty matters).
              <br />
              <span className="mt-3 inline-block rounded-full border border-indigoBlue bg-indigoBlue/20 px-3 py-1 text-xs font-semibold text-indigoBlue">
                RTI Act, 2005 · Section 6
              </span>
            </div>
            <div className="max-w-[80%] self-end rounded-[20px_20px_4px_20px] bg-saffron px-6 py-4 text-sm font-medium text-ap-bg">
              What is the process for bail in non-bailable offenses?
            </div>
            <div className="max-w-[80%] self-start rounded-[4px_20px_20px_20px] border border-white/10 bg-ap-glass p-6 text-cream leading-relaxed">
              For non-bailable offenses under CrPC Section 437, bail is discretionary. The court considers:
              nature of accusation, severity of punishment, evidence available, and likelihood of tampering.
              Anticipatory bail can be sought under Section 438 if apprehending arrest.
              <br />
              <span className="mt-3 inline-block rounded-full border border-indigoBlue bg-indigoBlue/20 px-3 py-1 text-xs font-semibold text-indigoBlue">
                CrPC · Sections 437-438
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 border-t border-white/10 p-6">
            <Link href="/chat" className="flex-1 text-ap-muted transition-colors hover:text-cream">
              Ask about any Indian law in the live app…
              <span className="ml-1 inline-block h-[1.2em] w-0.5 animate-ap-cursor bg-saffron align-middle" />
            </Link>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="bg-saffron px-8 py-24 text-center text-ap-bg" id="manifesto">
        <h2 className="mx-auto mb-6 max-w-[800px] font-serif text-[clamp(1.75rem,4vw,3rem)] leading-snug">
          &ldquo;No face. No corruption. No compromise.
          <br />
          Just the system.&rdquo;
        </h2>
        <p className="mx-auto mb-8 max-w-[600px] text-lg opacity-90 leading-relaxed">
          The Abstract Party does not contest elections. It does not campaign. It does not negotiate. It
          simply runs — and you can read every line of its code.
        </p>
        <Link
          href="/transparency"
          className="inline-block border-b-2 border-ap-bg pb-0.5 font-bold text-ap-bg transition-opacity hover:opacity-70"
        >
          Explore transparency →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-ap-bg px-8 pb-8 pt-16" id="join">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-8 text-center md:grid-cols-[1fr_auto_1fr] md:text-left">
          <div className="flex items-center justify-center gap-4 md:justify-start">
            <AshokaChakra size="sm" />
            <span className="font-serif text-2xl font-semibold text-cream">Abstract Party</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-8">
            {["#vision", "#modules", "#how", "#manifesto"].map((href, i) => {
              const labels = ["Vision", "Modules", "Process", "Manifesto"];
              return (
                <a key={href} href={href} className="text-sm text-ap-muted transition-colors hover:text-cream">
                  {labels[i]}
                </a>
              );
            })}
          </div>
          <div className="text-sm text-ap-muted md:text-right">Open Source · Built for 1.4B Indians</div>
        </div>
        <div className="mx-auto mt-12 max-w-[1200px] border-t border-white/5 pt-8 text-center text-sm text-ap-muted">
          abstractparty.in · All decisions are public · No humans harmed in the making of this government
        </div>
      </footer>
    </div>
  );
}
