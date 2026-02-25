"use client";

import { useEffect, useRef, useState } from "react";

// ── tiny hook: fires callback once when element enters viewport ──
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── animated counter ──
function Counter({
  target,
  prefix = "",
  suffix = "+",
}: {
  target: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(el);
        let start: number | null = null;
        const duration = 1800;
        const step = (ts: number) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

// ── FAQ item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "28px 0",
          cursor: "pointer",
          textAlign: "left",
          color: "var(--text)",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1rem",
          fontWeight: 400,
          gap: 20,
          transition: "color 0.3s",
        }}
      >
        {q}
        <span
          style={{
            width: 28,
            height: 28,
            border: `1px solid ${open ? "var(--gold)" : "var(--border-light)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            color: open ? "var(--gold)" : "var(--text-subtle)",
            flexShrink: 0,
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "all 0.3s",
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? 200 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        <p
          style={{
            paddingBottom: 28,
            fontSize: "0.92rem",
            color: "var(--text-muted)",
            lineHeight: 1.8,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

// ── Reveal wrapper ──
function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ════════════════════════════════════════
//  MAIN PAGE
// ════════════════════════════════════════
export default function Home() {
  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        :root {
          --bg: #09090a;
          --bg-card: #111112;
          --bg-card2: #181819;
          --text: #f0ece2;
          --text-muted: #7a7670;
          --text-subtle: #4a4845;
          --gold: #c9a96e;
          --gold-light: #e8d9b8;
          --gold-dim: #6e5c3a;
          --border: #222220;
          --border-light: #2e2d2a;
        }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; font-weight: 300; line-height: 1.7; overflow-x: hidden; }
        body::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E"); opacity: 0.025; pointer-events: none; z-index: 9999; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 2px; }

        /* Reveal animation */
        .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        /* Marquee */
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { display: flex; width: max-content; animation: marquee 28s linear infinite; }

        /* Green pulse */
        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
          50% { box-shadow: 0 0 0 7px rgba(74,222,128,0); }
        }

        /* Scroll line */
        @keyframes grow-line { 0%,100%{transform:scaleY(0.5);opacity:0.4} 50%{transform:scaleY(1);opacity:1} }

        /* Process card hover */
        .process-card { background: var(--bg-card); padding: 56px 48px; position: relative; overflow: hidden; transition: background 0.4s; }
        .process-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform 0.4s ease; }
        .process-card:hover { background: var(--bg-card2); }
        .process-card:hover::before { transform:scaleX(1); }
        .process-card:hover .proc-num { color: var(--gold-dim); }

        /* Service card hover */
        .service-card { border: 1px solid var(--border); padding: 44px 36px; transition: border-color 0.4s; }
        .service-card:hover { border-color: var(--gold-dim); }
        .service-card:hover .svc-icon { border-color: var(--gold); background: rgba(201,169,110,0.05); }

        /* Testimonial card */
        .t-card { background: var(--bg); border: 1px solid var(--border); padding: 36px 32px; transition: border-color 0.4s, transform 0.4s; }
        .t-card:hover { border-color: var(--gold-dim); transform: translateY(-4px); }

        /* Nav CTA */
        .nav-cta { background: transparent; border: 1px solid var(--gold-dim); color: var(--gold); padding: 10px 24px; font-family: 'Outfit', sans-serif; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; }
        .nav-cta:hover { background: var(--gold); color: var(--bg); border-color: var(--gold); }

        /* Buttons */
        .btn-primary { background: var(--gold); color: var(--bg); padding: 16px 36px; font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: background 0.3s; display: inline-block; }
        .btn-primary:hover { background: var(--gold-light); }
        .btn-ghost { border: 1px solid var(--border-light); color: var(--text-muted); padding: 16px 36px; font-size: 0.82rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; display: inline-block; }
        .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

        /* Footer links */
        .footer-link { font-size: 0.85rem; color: var(--text-muted); text-decoration: none; transition: color 0.3s; display: block; margin-bottom: 10px; }
        .footer-link:hover { color: var(--text); }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .process-grid { grid-template-columns: 1fr !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .stats-bar { grid-template-columns: repeat(2,1fr) !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .hero h1 { font-size: clamp(2.4rem,8vw,4rem) !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "20px 5%", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(9,9,10,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(201,169,110,0.08)",
      }}>
        <a href="#" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 500, color: "var(--text)", textDecoration: "none" }}>
          Nexol <span style={{ color: "var(--gold)" }}>Media</span>
        </a>
        <ul className="hide-mobile" style={{ display: "flex", gap: 36, listStyle: "none" }}>
          {["Process", "Services", "Results", "FAQ"].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {item}
              </a>
            </li>
          ))}
        </ul>
        <a href="https://cal.com/niteshbandekar/15min" target="_blank" rel="noreferrer" className="nav-cta">
          Book a Call
        </a>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", textAlign: "center", padding: "140px 5% 80px", position: "relative", overflow: "hidden",
      }}>
        {/* glow */}
        <div style={{ position: "absolute", width: 600, height: 600, background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
        {/* bottom border */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--gold-dim), transparent)" }} />

        {/* badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid var(--border-light)", padding: "8px 18px", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 48 }}>
          <span style={{ width: 6, height: 6, background: "#4ade80", borderRadius: "50%", animation: "pulse-green 2s infinite" }} />
          Available for new clients
        </div>

        <p style={{ fontSize: "0.72rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 24 }}>
          Meta Ads · Content · Automation
        </p>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3rem,7vw,6.5rem)", fontWeight: 300, lineHeight: 1.05, maxWidth: 900, marginBottom: 32 }}>
          We Build{" "}
          <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Revenue Engines</em>
          <br />for Service Businesses
        </h1>

        <p style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: 520, marginBottom: 52, fontWeight: 300, lineHeight: 1.8 }}>
          Strategic content, high-performance video editing, and data-driven advertising systems that turn attention into predictable revenue.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://cal.com/niteshbandekar/15min" target="_blank" rel="noreferrer" className="btn-primary">
            Book a Free Strategy Call
          </a>
          <a href="#process" className="btn-ghost">
            See How It Works
          </a>
        </div>

        {/* scroll hint */}
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--text-subtle)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, var(--gold-dim), transparent)", animation: "grow-line 2s ease infinite" }} />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "32px 0", overflow: "hidden" }}>
        <div className="marquee-track">
          {["Meta Ads", "Content Strategy", "Lead Generation", "Video Editing", "Marketing Automation", "Revenue Growth", "Service Businesses", "Campaign Analytics",
            "Meta Ads", "Content Strategy", "Lead Generation", "Video Editing", "Marketing Automation", "Revenue Growth", "Service Businesses", "Campaign Analytics"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "0 48px", whiteSpace: "nowrap", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-subtle)" }}>
                {item}
                <span style={{ width: 4, height: 4, background: "var(--gold-dim)", borderRadius: "50%" }} />
              </div>
            ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="stats-bar" style={{ borderBottom: "1px solid var(--border)", padding: "60px 5%", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
        {[
          { target: 40, suffix: "+", label: "Clients Served" },
          { target: 110, prefix: "$", suffix: "K+", label: "Best Client Revenue Added" },
          { target: 90, suffix: " Days", label: "Average Time to Results" },
          { target: 30, suffix: "-60 Days", label: "First Traction Window" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "0 40px", borderRight: i < 3 ? "1px solid var(--border)" : "none", textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem,4vw,4rem)", fontWeight: 300, color: "var(--gold)", lineHeight: 1, marginBottom: 8 }}>
              <Counter target={s.target} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── PROCESS ── */}
      <section id="process" style={{ padding: "120px 5%", background: "var(--bg-card)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 64 }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--gold)" }}>01</span>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-subtle)" }}>How We Work</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
        <Reveal>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 300, lineHeight: 1.1, maxWidth: 700, marginBottom: 80 }}>
            A system built to <em style={{ fontStyle: "italic", color: "var(--gold)" }}>compound</em> your growth
          </h2>
        </Reveal>
        <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)" }}>
          {[
            { n: "01", title: "Strategy & Discovery", body: "We define your audience, messaging, creative angles, and growth objectives to build a clear content and ad strategy aligned to your revenue goals." },
            { n: "02", title: "Production & Execution", body: "We plan, script, edit, and produce high-performing videos and marketing assets designed to attract the right customer and convert them." },
            { n: "03", title: "Campaign Launch & Distribution", body: "Meta ads and organic content are deployed strategically to generate awareness, inbound leads, and consistent engagement that compounds over time." },
            { n: "04", title: "Analytics & Scaling", body: "We analyze performance data, improve creatives and funnels, and scale campaigns that drive predictable revenue growth month over month." },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="process-card">
                <div className="proc-num" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "4rem", fontWeight: 300, color: "var(--text-subtle)", lineHeight: 1, marginBottom: 32, transition: "color 0.4s" }}>{c.n}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 400, marginBottom: 16 }}>{c.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.8, maxWidth: 340 }}>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: "120px 5%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 64 }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--gold)" }}>02</span>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-subtle)" }}>What We Do</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
        <Reveal>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 300, lineHeight: 1.1, maxWidth: 700, marginBottom: 80 }}>
            Everything you need to <em style={{ fontStyle: "italic", color: "var(--gold)" }}>dominate</em> your market
          </h2>
        </Reveal>
        <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {[
            { icon: "◈", title: "Meta Advertising", body: "High-ROI paid campaigns on Facebook and Instagram, built for local service businesses that need a consistent flow of qualified leads." },
            { icon: "◇", title: "Content Creation", body: "Strategic short-form video content, scripts, and creatives that build authority, trust, and organic reach in your local market." },
            { icon: "○", title: "Video Editing", body: "Professional video editing optimized for social media performance — hooks, pacing, captions, and graphics that stop the scroll." },
            { icon: "△", title: "Lead Generation Systems", body: "End-to-end funnels that capture, qualify, and nurture leads automatically — so your calendar stays full without chasing." },
            { icon: "□", title: "Marketing Automation", body: "Follow-up sequences, CRM workflows, and automated nurturing that convert leads into booked jobs without manual effort." },
            { icon: "⬡", title: "Performance Analytics", body: "Clear, actionable reporting on every metric that matters — so you always know exactly what your marketing is returning." },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="service-card">
                <div className="svc-icon" style={{ width: 48, height: 48, border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, fontSize: "1.2rem", color: "var(--gold)", transition: "border-color 0.4s, background 0.4s" }}>
                  {s.icon}
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.8 }}>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="results" style={{ padding: "120px 5%", background: "var(--bg-card)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 64 }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--gold)" }}>03</span>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-subtle)" }}>Client Results</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
        <Reveal>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 300, lineHeight: 1.1, maxWidth: 700, marginBottom: 80 }}>
            Real results from <em style={{ fontStyle: "italic", color: "var(--gold)" }}>real</em> businesses
          </h2>
        </Reveal>
        <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[
            { tag: "31 Calls in 30 Days", quote: "We got 31 calls in 30 days and booked 14 moves. I was honestly shocked and relieved. Calendar finally looked full again.", name: "John Parker", company: "Texas Moving LLC", initials: "JP" },
            { tag: "9 Jobs in One Month", quote: "Closed 9 flooring jobs in one month. These were real homeowners, not price shoppers. I felt confident hiring another installer.", name: "Mark Robertson", company: "Ohio Flooring", initials: "MR" },
            { tag: "$110K Extra in 90 Days", quote: "Our phone didn't stop ringing, and we hit about $110K extra revenue in 90 days. It took a huge weight off my shoulders.", name: "Jake Miller", company: "East Coast Junk Removals", initials: "JM" },
            { tag: "3 Quotes a Day", quote: "We went from 2 quotes a week to 3 a day. Crews stayed fully booked and I stopped stressing about slow weeks entirely.", name: "Mike Carter", company: "16th Street Fencing", initials: "MC" },
            { tag: "18 Leads in 3 Weeks", quote: "Got 18 pool cover leads in 3 weeks and booked 7 installs. Follow-ups ran on autopilot, which saved me tons of time.", name: "Wilson", company: "Wales Pool Services", initials: "WP" },
            { tag: "$42K in 2 Months", quote: "We added around $42K in basement work in 2 months. Felt unreal and exciting. Finally getting big projects, not just inspections.", name: "Chris Davis", company: "DFG Waterproofing", initials: "CD" },
          ].map((t, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="t-card">
                <div style={{ display: "inline-block", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", color: "var(--gold)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", marginBottom: 16 }}>
                  {t.tag}
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 300, fontStyle: "italic", lineHeight: 1.6, color: "var(--text)", marginBottom: 28 }}>
                  "{t.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "var(--gold)", fontWeight: 500 }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>{t.company}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "120px 5%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 64 }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--gold)" }}>04</span>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-subtle)" }}>FAQ</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
        <Reveal>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 300, lineHeight: 1.1, maxWidth: 700, marginBottom: 80 }}>
            Questions we <em style={{ fontStyle: "italic", color: "var(--gold)" }}>hear</em> often
          </h2>
        </Reveal>
        <div style={{ maxWidth: 760 }}>
          <FaqItem q="What does Nexol Media do?" a="Nexol Media helps businesses grow through strategic content creation, performance video editing, and paid advertising systems designed to generate customers consistently and predictably." />
          <FaqItem q="Who is Nexol Media for?" a="We work with small and mid-sized service businesses — movers, flooring contractors, waterproofing companies, pool installers, junk removal, CPAs, and more — looking to scale revenue using content and marketing." />
          <FaqItem q="How does your lead generation system work?" a="We create targeted content, run Meta ad campaigns, optimize creatives continuously, and build conversion-focused systems that turn attention into booked appointments and paying customers." />
          <FaqItem q="How long does it take to see results?" a="Most clients begin seeing traction within 30–60 days as campaigns optimize and content distribution compounds. Results grow significantly over 90 days as the system matures." />
          <FaqItem q="Do you work with local service businesses specifically?" a="Yes — it's our specialty. We've helped movers, flooring contractors, waterproofing companies, pool installers, junk removal services, CPAs, and fencing companies all generate consistent revenue through our systems." />
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "140px 5%", textAlign: "center", position: "relative", overflow: "hidden", borderTop: "1px solid var(--border)" }}>
        <div style={{ position: "absolute", width: 800, height: 400, background: "radial-gradient(ellipse, rgba(201,169,110,0.05) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
        <Reveal>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem,6vw,5.5rem)", fontWeight: 300, lineHeight: 1.1, maxWidth: 800, margin: "0 auto 24px" }}>
            Ready to <em style={{ fontStyle: "italic", color: "var(--gold)" }}>fill your calendar</em>
            <br />with real customers?
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: 480, margin: "0 auto 52px", lineHeight: 1.8 }}>
            Book a free 15-minute strategy call. We'll map out a 90-day customer acquisition roadmap tailored to your business — no fluff, no pressure.
          </p>
          <a href="https://cal.com/niteshbandekar/30min" target="_blank" rel="noreferrer" className="btn-primary" style={{ fontSize: "0.9rem", padding: "18px 48px" }}>
            Book Your Free Strategy Call →
          </a>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "72px 5% 0" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 48, paddingBottom: 48 }}>
          <div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "var(--text)", display: "block", marginBottom: 16 }}>
              Nexol <span style={{ color: "var(--gold)" }}>Media</span>
            </span>
            <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)", lineHeight: 1.8, maxWidth: 260 }}>
              We build revenue engines for service businesses using content, Meta Ads, and intelligent automation.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 20 }}>Navigation</h4>
            {["Process", "Services", "Results", "FAQ"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="footer-link">{l}</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 20 }}>Services</h4>
            {["Meta Advertising", "Content Creation", "Video Editing", "Lead Generation"].map((l) => (
              <span key={l} className="footer-link" style={{ cursor: "default" }}>{l}</span>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 20 }}>Contact</h4>
            <a href="tel:+917058025578" className="footer-link">+91 705 802 5578</a>
            <a href="mailto:info@nexolmedia.com" className="footer-link">info@nexolmedia.com</a>
            <a href="https://cal.com/niteshbandekar/15min" target="_blank" rel="noreferrer" className="footer-link">Book a Call ↗</a>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", padding: "24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>© 2026 Nexol Media. All rights reserved.</p>
          <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", letterSpacing: "0.08em" }}>META ADS · CONTENT · AUTOMATION</p>
        </div>
      </footer>
    </>
  );
}
