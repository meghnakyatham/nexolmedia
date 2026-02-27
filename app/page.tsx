"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Instagram,
  Video,
  BarChart3,
  Zap,
  Settings,
  Search,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Layout,
  MessageSquare,
  Facebook
} from "lucide-react";

/* ─────────────────────────────────────────────
   HOOK: fires once when element enters viewport
   ───────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold, rootMargin: "0px 0px -48px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─────────────────────────────────────────────
   COMPONENT: Animated Counter
   ───────────────────────────────────────────── */
function Counter({ target, prefix = "", suffix = "+" }: { target: number; prefix?: string; suffix?: string; }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useReveal(0.5);
  useEffect(() => {
    if (!visible) return;
    let start: number | null = null;
    const duration = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target]);
  return <span ref={ref as React.RefObject<HTMLSpanElement>}>{prefix}{count}{suffix}</span>;
}

function BlockReveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string; }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`block-reveal${visible ? " visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: CTA Button (with animation)
   ───────────────────────────────────────────── */
function CtaButton({ href, children, className = "", style = {}, onClick }: { href: string; children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void; }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" onClick={onClick} className={`cta-pill ${className}`} style={style}>
      <span className="btn-text">{children}</span>
      <div className="icon-fill" aria-hidden="true" />
      <ChevronRight className="btn-icon" size={20} strokeWidth={2.5} />
    </a>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: FAQ Item
   ───────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)", transition: "border-color 0.3s" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width: "100%", background: "none", border: "none",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "26px 0", cursor: "pointer", textAlign: "left",
          color: "var(--text)", fontFamily: "var(--font)",
          fontSize: "1rem", fontWeight: 400, gap: 20, lineHeight: 1.5,
        }}
      >
        <span>{q}</span>
        <span style={{
          width: 32, height: 32, border: `1px solid ${open ? "var(--accent)" : "var(--border-md)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.3rem", color: open ? "var(--accent)" : "var(--text-3)",
          flexShrink: 0, transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)", fontWeight: 300, lineHeight: 1,
          borderRadius: 4,
        }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height 0.45s cubic-bezier(0.16,1,0.3,1)" }}>
        <p style={{ paddingBottom: 28, fontSize: "0.93rem", color: "var(--text-2)", lineHeight: 1.85 }}>{a}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Testimonial Card (for slider)
   ───────────────────────────────────────────── */
function TestCard({ tag, quote, name, company, initials }: { tag: string; quote: string; name: string; company: string; initials: string; }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--x", `${x}px`);
    cardRef.current.style.setProperty("--y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="testimonial-card torch-card card-lift"
      style={{
        padding: "36px 32px", flexShrink: 0,
        position: "relative", borderRadius: 12,
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--accent-red)", opacity: 1, borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
      <div style={{
        display: "inline-block",
        background: "var(--accent-bg2)",
        color: "var(--text)", fontSize: "0.7rem", letterSpacing: "0.08em",
        textTransform: "uppercase", padding: "6px 14px", marginBottom: 20,
        fontFamily: "var(--font)", fontWeight: 800, borderRadius: 100,
      }}>{tag}</div>
      <p style={{ fontSize: "1rem", fontWeight: 450, lineHeight: 1.7, color: "var(--text)", marginBottom: 32, fontStyle: "normal", opacity: 0.9 }}>
        &ldquo;{quote}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "var(--bg-surface2)", border: "1px solid var(--border-md)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.75rem", color: "var(--text)",
          fontFamily: "var(--font)", fontWeight: 700,
        }}>{initials}</div>
        <div>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)" }}>{name}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-3)", marginTop: 2 }}>{company}</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Service Card
   ───────────────────────────────────────────── */
function ServiceCard({ icon: Icon, title, body }: { icon: any; title: string; body: string; }) {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        {/* Front of card */}
        <div className="flip-card-front">
          <div style={{
            width: 70, height: 70, background: "var(--accent-bg)",
            color: "var(--text)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "1.8rem", marginBottom: 32,
            borderRadius: 16, border: "1px solid var(--accent)"
          }}><Icon size={32} strokeWidth={1.5} /></div>
          <h3 style={{
            fontFamily: "var(--font)", fontSize: "1.25rem", fontWeight: 800,
            color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1.3
          }}>{title}</h3>
        </div>

        {/* Back of card */}
        <div className="flip-card-back">
          <p style={{
            fontSize: "0.95rem", color: "var(--text-2)", lineHeight: 1.7,
            fontWeight: 450, textAlign: "center"
          }}>{body}</p>
          <div style={{ marginTop: 32, width: "100%" }}>
            <CtaButton href="https://cal.com/niteshbandekar/15min" style={{ width: "100%", justifyContent: "center" }}>
              Book a Call
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
   ───────────────────────────────────────────── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  /* ── Testimonials ── */
  const testimonials = [
    { tag: "31 Calls in 30 Days", quote: "We got 31 calls in 30 days and booked 14 moves. I was honestly shocked and relieved. Calendar finally looked full again.", name: "John Parker", company: "Texas Moving LLC", initials: "JP" },
    { tag: "9 Jobs in One Month", quote: "Closed 9 flooring jobs in one month. These were real homeowners, not price shoppers. I felt confident hiring another installer.", name: "Mark Robertson", company: "Ohio Flooring", initials: "MR" },
    { tag: "$110K Extra in 90 Days", quote: "Our phone didn't stop ringing, and we hit about $110K extra revenue in 90 days. It took a huge weight off my shoulders.", name: "Jake Miller", company: "East Coast Junk Removals", initials: "JM" },
    { tag: "3 Quotes Every Day", quote: "We went from 2 quotes a week to 3 a day. Crews stayed fully booked, revenue stabilized, and I stopped stressing about slow weeks entirely.", name: "Mike Carter", company: "16th Street Fencing", initials: "MC" },
    { tag: "18 Leads in 3 Weeks", quote: "Got 18 pool cover leads in 3 weeks and booked 7 installs. Follow-ups ran on autopilot, which saved me tons of time.", name: "Wilson Pool Covers", company: "Wales Pool Services", initials: "WP" },
    { tag: "$42K in 2 Months", quote: "We added around $42K in basement work in 2 months. Felt unreal and exciting. Finally getting big projects, not just inspections.", name: "Chris Davis", company: "DFG Waterproofing", initials: "CD" },
    { tag: "6 New Clients in 45 Days", quote: "Added 6 new monthly clients in 45 days without cold calling. People already trusted us, and onboarding felt smooth and simple.", name: "Sarah Thompson", company: "Thompson CPA", initials: "ST" },
    { tag: "5 Foundation Jobs — Month 1", quote: "Booked 5 foundation jobs in the first month. These were serious homeowners ready to fix problems, and the checks were big.", name: "Robert Hayes", company: "Hayes Foundation", initials: "RH" },
  ];

  const firstRow = testimonials.slice(0, 4);
  const secondRow = testimonials.slice(4);



  const services = [
    { icon: Facebook, title: "Meta Advertising", body: "High-ROI paid campaigns on Facebook and Instagram, built for local service businesses that need a consistent flow of qualified leads." },
    { icon: Video, title: "Content Creation", body: "Strategic short-form video content, scripts, and creatives that build authority, trust, and organic reach in your local market." },
    { icon: Zap, title: "Video Editing", body: "Professional video editing optimized for social media performance — hooks, pacing, captions, and graphics that stop the scroll." },
    { icon: TrendingUp, title: "Lead Generation Systems", body: "End-to-end funnels that capture, qualify, and nurture leads automatically — so your calendar stays full without chasing." },
    { icon: Settings, title: "Marketing Automation", body: "Follow-up sequences, CRM workflows, and automated nurturing that convert leads into booked jobs without manual effort." },
    { icon: BarChart3, title: "Performance Analytics", body: "Clear, actionable reporting on every metric that matters — so you always know exactly what your marketing is returning." },
  ];

  const processSteps = [
    { n: "01", title: "Strategy & Discovery", body: "We define your audience, messaging, creative angles, and growth objectives to build a clear content and ad strategy aligned to your revenue goals." },
    { n: "02", title: "Production & Execution", body: "We plan, script, edit, and produce high-performing videos and marketing assets designed to attract the right customer and convert them." },
    { n: "03", title: "Campaign Launch & Distribution", body: "Meta ads and organic content are deployed strategically to generate awareness, inbound leads, and consistent engagement that compounds over time." },
    { n: "04", title: "Analytics & Scaling", body: "We analyze performance data, improve creatives and funnels, and scale campaigns that drive predictable revenue growth month over month." },
  ];

  const faqs = [
    { q: "What does Nexol Media do?", a: "Nexol Media helps businesses grow through strategic content creation, performance video editing, and paid advertising systems designed to generate customers consistently and predictably." },
    { q: "Who is Nexol Media for?", a: "We work with small and mid-sized service businesses — movers, flooring contractors, waterproofing companies, pool installers, junk removal, CPAs, and more — looking to scale revenue using content and marketing." },
    { q: "How does your lead generation system work?", a: "We create targeted content, run Meta ad campaigns, optimize creatives continuously, and build conversion-focused systems that turn attention into booked appointments and paying customers." },
    { q: "How long does it take to see results?", a: "Most clients begin seeing traction within 30–60 days as campaigns optimize and content distribution compounds. Results grow significantly over 90 days as the system matures." },
    { q: "Do you work with local service businesses specifically?", a: "Yes — it's our specialty. We've helped movers, flooring contractors, waterproofing companies, pool installers, junk removal services, CPAs, and fencing companies all generate consistent revenue." },
    { q: "What makes Nexol Media different from other agencies?", a: "We don't just run ads. We build complete revenue systems — combining content strategy, video production, paid campaigns, and automation that work together to create predictable, scalable lead flow." },
  ];

  const marqueeItems = ["Meta Advertising", "Content Strategy", "Lead Generation", "Video Editing", "Marketing Automation", "Revenue Growth", "Service Businesses", "Campaign Analytics"];

  const pricingPlans = [
    { title: "Foundations", price: "$2.5k", features: ["Content Strategy", "Video Production", "Organic Growth", "1 Acquisition Channel"], popular: false },
    { title: "Accelerator", price: "$5.0k", features: ["Meta Ads Management", "Lead Gen Funnels", "Authority Content", "2 Acquisition Channels"], popular: true },
    { title: "Scale", price: "Custom", features: ["CRM Automation", "Revenue Systems", "Proprietary Tracking", "Multi-Channel Scale"], popular: false }
  ];

  const benefits = [
    { title: "Predictable Growth", body: "No more guessing where your next lead is coming from. We build systems that deliver customers consistently." },
    { title: "Done-For-You", body: "We handle the scripting, editing, filming plan, and ad management. You focus on closing the jobs." },
    { title: "Direct ROI", body: "We don't track vanity metrics. We track appointments, booked calls, and revenue generated for your business." }
  ];

  return (
    <>
      <style>{`
        /* ── Base font override ── */
        * { font-family: var(--font); }

        /* ── NAV ── */
        .nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1400px; margin: 0 auto; padding: 0 5%;
        }
        .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; }
        .nav-link {
          color: var(--text-2); text-decoration: none; font-size: 0.82rem;
          letter-spacing: 0.06em; font-weight: 450; transition: color 0.25s;
        }
        .nav-link:hover { color: var(--text); }

        .btn-primary {
          background: var(--btn-bg); color: var(--btn-text);
          padding: 13px 28px; font-family: var(--font);
          font-size: 0.82rem; font-weight: 600; letter-spacing: 0.04em;
          text-decoration: none; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-block; border: none; cursor: pointer; border-radius: 100px;
        }
        .btn-primary:hover { background: var(--accent); color: var(--text); transform: translateY(-1px); box-shadow: 0 4px 12px var(--accent-glow); }

        .btn-outline {
          border: 1.5px solid var(--border-md); color: var(--text-2);
          padding: 13px 28px; font-size: 0.82rem; font-weight: 400; letter-spacing: 0.04em;
          text-decoration: none; transition: all 0.3s; display: inline-block;
          font-family: var(--font); border-radius: 100px;
        }
        .btn-outline:hover { border-color: var(--text); color: var(--text); background: var(--bg-surface); }

        /* ── Section label ── */
        .section-label { display: flex; align-items: center; gap: 14px; margin-bottom: 52px; }
        .section-label-num {
          font-family: var(--font); font-size: 0.68rem;
          letter-spacing: 0.22em; color: var(--text-3); font-weight: 600;
        }
        .section-label-text {
          font-size: 0.68rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--text-3); font-weight: 400;
        }
        .section-label-line { flex: 1; height: 1px; background: var(--border); }

        /* ── HERO ── */
        .hero-title {
          font-family: var(--font);
          font-size: clamp(2.6rem, 6vw, 4.8rem);
          font-weight: 800; line-height: 1.1; letter-spacing: -0.01em;
          color: var(--text); text-align: center; max-width: 1150px; margin: 0 auto 32px;
        }
        .hero-sup {
          font-size: 0.72rem; letter-spacing: 0.24em; text-transform: uppercase;
          color: var(--text); margin-bottom: 12px; font-weight: 500;
        }
        .hero-sub {
          font-size: 1.05rem; color: var(--text-2); max-width: 520px;
          margin: 0 auto 40px; line-height: 1.8; text-align: center; font-weight: 400;
        }

        /* ── STATS ── */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
        .stat-item {
          padding: 52px 36px; text-align: center;
          border-right: 1px solid var(--border);
          transition: background 0.3s;
        }
        .stat-item:hover { background: var(--accent-bg); }
        .stat-item:last-child { border-right: none; }
        .stat-number {
          font-family: var(--font);
          font-size: clamp(2.2rem, 4.5vw, 3.6rem);
          font-weight: 700; color: var(--text); line-height: 1;
          margin-bottom: 10px; letter-spacing: -0.03em;
        }
        .stat-label {
          font-size: 0.73rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--text-3); font-weight: 400;
        }

        /* ── PROCESS ── */
        .process-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 1px; background: var(--border); border: 1px solid var(--border);
        }
        .process-card {
          background: var(--bg); padding: 56px 48px;
          position: relative; overflow: hidden; transition: background 0.4s;
        }
        .process-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0;
          height: 2px; background: var(--accent);
          transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease;
        }
        .process-card:hover { background: var(--accent-bg2); }
        .process-card:hover::before { transform: scaleX(1); }
        .proc-num {
          font-family: var(--font); font-size: 4.5rem; font-weight: 700;
          color: var(--border-md); line-height: 1; margin-bottom: 28px;
          letter-spacing: -0.04em; transition: color 0.4s;
        }
        .process-card:hover .proc-num { color: #061a40; }
        .proc-title {
          font-family: var(--font); font-size: 1.15rem; font-weight: 700;
          margin-bottom: 14px; color: var(--text); letter-spacing: -0.01em;
        }
        .proc-body { font-size: 0.92rem; color: var(--text-2); line-height: 1.8; max-width: 340px; }

        /* ── TESTIMONIALS SLIDER ── */
        .testimonials-slider-wrap {
          overflow-x: auto; cursor: grab; position: relative;
          scrollbar-width: none; -ms-overflow-style: none;
          padding-bottom: 8px;
        }
        .testimonials-slider-wrap::-webkit-scrollbar { display: none; }
        .testimonials-slider-wrap.dragging { cursor: grabbing; }
        .testimonials-slider-track {
          display: flex; gap: 24px; width: max-content;
          user-select: none;
        }

        /* ── SERVICES ── */
        .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .flip-card {
          background-color: transparent;
          height: 320px;
          perspective: 1000px; /* 3D effect */
          border-radius: 16px;
          border: 1px solid var(--border);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: none;
        }
        .flip-card:hover {
          border-color: var(--accent);
          transform: translateY(-4px);
          box-shadow: 0 10px 30px var(--accent-glow);
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.8s;
          transform-style: preserve-3d;
          border-radius: 16px;
        }
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden; /* Safari */
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 36px;
          border-radius: 16px;
          background: var(--bg);
        }
        .flip-card-back {
          transform: rotateY(180deg);
          background: var(--bg-surface);
        }

        /* ── FOOTER ── */
        .footer-grid {
          display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 48px; padding-bottom: 48px;
        }
        .footer-link {
          font-size: 0.85rem; color: var(--text-2); text-decoration: none;
          transition: color 0.25s; display: block; margin-bottom: 10px;
        }
        .footer-link:hover { color: var(--text-accent); }

        /* ── CTA ── */
        .cta-big {
          font-family: var(--font);
          font-size: clamp(2.4rem, 5.5vw, 5rem);
          font-weight: 800; line-height: 1.04; letter-spacing: -0.03em;
          max-width: 780px; margin: 0 auto 24px; text-align: center;
        }

        /* ── PAGE WRAP ── */
        .page-wrap { max-width: 1400px; margin: 0 auto; padding: 0 5%; }

        /* ── MOBILE HAMBURGER ── */
        .ham-btn {
          display: none; background: none; border: 1px solid var(--border-md);
          color: var(--text); padding: 8px 14px; cursor: pointer; font-size: 1.1rem;
        }
        @media (max-width: 768px) { .ham-btn { display: flex; align-items: center; } }

        /* ── MOB MENU ── */
        .mob-menu {
          display: none; position: fixed; inset: 0; z-index: 200;
          background: var(--bg); flex-direction: column;
          align-items: center; justify-content: center; gap: 36px;
        }
        .mob-menu.open { display: flex; }
        .mob-menu a {
          font-family: var(--font); font-size: 1.5rem; font-weight: 600;
          color: var(--text); text-decoration: none; transition: color 0.25s;
        }
        .mob-menu a:hover { color: var(--text-2); }
        .mob-close {
          position: absolute; top: 24px; right: 5%;
          background: none; border: 1px solid var(--border-md);
          color: var(--text); padding: 8px 14px; cursor: pointer; font-size: 1.1rem;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .nav-links, .nav-cta-wrap { display: none !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stat-item:nth-child(2) { border-right: none; }
          .stat-item { border-bottom: 1px solid var(--border); }
          .stat-item:nth-child(3), .stat-item:nth-child(4) { border-bottom: none; }
          .process-grid { grid-template-columns: 1fr !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .process-card { padding: 40px 24px !important; }
          .hero-title { font-size: clamp(2rem, 9vw, 3.2rem) !important; margin-bottom: 24px !important; }
          .hero-sub { margin-bottom: 40px !important; }
          .hero-cta-group { margin-top: 40px !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .process-grid { grid-template-columns: 1fr !important; }
          .process-card { padding: 44px 36px !important; }
        }
        @media (max-width: 900px) {
          .faq-inner { grid-template-columns: 1fr !important; }
          .faq-inner h2 { position: static !important; margin-bottom: 40px !important; }
        }
      `}</style>

      {/* ══ MOBILE MENU ══ */}
      <div className={`mob-menu${mobileMenuOpen ? " open" : ""}`} role="dialog" aria-modal="true">
        <button className="mob-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">✕</button>
        {["Process", "Benefits", "Projects", "Pricing"].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}>{item}</a>
        ))}
        <CtaButton href="https://cal.com/niteshbandekar/15min" onClick={() => setMobileMenuOpen(false)} style={{ marginTop: 24 }}>
          Book a Call
        </CtaButton>
      </div>

      {/* ══ PLAN BAR (PRIMARY HEADER) ══ */}
      <div className="plan-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 24, height: 24, background: "var(--bg-dark)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M5 19L19 5M5 5L19 19" /></svg>
          </div>
          <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>Nexol Media</span>
        </div>
        <div className="plan-bar-links hide-mob">
          {["Process", "Benefits", "Projects", "Pricing"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="plan-bar-link">{l}</a>
          ))}
        </div>
        <a href="#pricing" className="plan-bar-cta">
          Choose your plan
          <div className="plan-bar-circle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
          </div>
        </a>
      </div>

      {/* ══ HERO ══ */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "140px 5% 100px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Subtle warm grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "80px 80px", opacity: 0.3,
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)",
          pointerEvents: "none",
        }} />
        {/* Accent glow matches new muted blue */}
        <div style={{
          position: "absolute", width: 600, height: 350, borderRadius: "50%",
          background: "radial-gradient(ellipse, var(--accent-bg) 0%, transparent 65%)",
          top: "42%", left: "50%", transform: "translate(-50%, -50%)",
          pointerEvents: "none", filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, var(--accent), transparent)", opacity: 0.1,
        }} />

        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>


          <p className="hero-sup">Meta Advertising · Content Strategy · Lead Generation</p>

          <h1 className="hero-title">
            We Build Revenue Engines
            <br />For Service Businesses
          </h1>

          <div className="hero-cta-group">
            <a href="https://cal.com/niteshbandekar/15min" className="cta-hero">
              Book a Call
              <div className="cta-hero-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
              </div>
            </a>

            <div className="trust-panel">
              <div className="avatar-stack">
                {['A', 'C', 'K', 'S', 'B'].map((initial, i) => (
                  <div key={i} className="stack-avatar" style={{ backgroundColor: i % 2 === 0 ? "var(--bg-surface2)" : "var(--accent-bg)" }}>
                    {initial}
                  </div>
                ))}
              </div>
              <div className="trust-info">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  ))}
                </div>
                <span className="trust-text">Trusted by 40+ Clients</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--text-3)",
        }}>
          <div style={{
            width: 1, height: 52,
            background: "linear-gradient(to bottom, var(--accent), transparent)",
            animation: "scroll-line 2.5s ease infinite",
          }} />
          <span style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Scroll</span>
        </div>
      </section>

      {/* ══ MARQUEE TICKER ══ */}
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "26px 0", overflow: "hidden", background: "var(--bg)" }}>
        <div className="marquee-fwd-fast marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 24, padding: "0 40px",
              whiteSpace: "nowrap", fontSize: "0.72rem", letterSpacing: "0.22em",
              textTransform: "uppercase", color: "var(--text)", fontWeight: 700,
            }}>
              {item}
              <span style={{ width: 6, height: 6, background: "var(--accent)", borderRadius: "50%", flexShrink: 0, opacity: 0.9 }} />
            </div>
          ))}
        </div>
      </div>

      {/* ══ STATS BAR ══ */}
      <div className="stats-grid" style={{ borderBottom: "1px solid var(--border)" }}>
        {[
          { target: 40, suffix: "+", label: "Clients Served" },
          { target: 110, prefix: "$", suffix: "K+", label: "Best Client Revenue Added" },
          { target: 90, suffix: " Days", label: "Average Time to Results" },
          { target: 30, suffix: "–60 Days", label: "First Traction Window" },
        ].map((s, i) => (
          <div key={i} className="stat-item">
            <div className="stat-number"><Counter target={s.target} prefix={s.prefix} suffix={s.suffix} /></div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ══ PROCESS ══ */}
      <section id="process" style={{ padding: "120px 5%", background: "var(--bg-surface)" }}>
        <div className="page-wrap" style={{ padding: 0 }}>
          <div className="section-label">
            <span className="section-label-num">01</span>
            <span className="section-label-text">How We Work</span>
            <div className="section-label-line" />
          </div>
          <BlockReveal>
            <h2 style={{
              fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
              fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em",
              maxWidth: 680, marginBottom: 72, color: "var(--text)",
            }}>
              A system built to{" "}
              <span style={{ color: "var(--text-accent)" }}>compound</span>{" "}your growth
            </h2>
          </BlockReveal>
          <div className="process-grid">
            {processSteps.map((c, i) => (
              <BlockReveal key={i} delay={i * 70}>
                <div className="process-card">
                  <div className="proc-num">{c.n}</div>
                  <h3 className="proc-title">{c.title}</h3>
                  <p className="proc-body">{c.body}</p>
                </div>
              </BlockReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BENEFITS (WHY US) ══ */}
      <section id="benefits" style={{ padding: "120px 5%", background: "var(--bg)" }}>
        <div className="page-wrap" style={{ padding: 0 }}>
          <div className="section-label">
            <span className="section-label-num">02</span>
            <span className="section-label-text">Benefits</span>
            <div className="section-label-line" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {benefits.map((b, i) => (
              <BlockReveal key={i} delay={i * 80}>
                <div style={{ padding: "40px 0", borderTop: "1px solid var(--border)" }}>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 16 }}>{b.title}</h3>
                  <p style={{ color: "var(--text-2)", fontSize: "1rem", lineHeight: 1.7 }}>{b.body}</p>
                </div>
              </BlockReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section id="services" style={{ padding: "120px 5%", background: "var(--bg-surface)" }}>
        <div className="page-wrap" style={{ padding: 0 }}>
          <div className="section-label">
            <span className="section-label-num">03</span>
            <span className="section-label-text">What We Do</span>
            <div className="section-label-line" />
          </div>
          <BlockReveal>
            <h2 style={{
              fontFamily: "var(--font)", fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
              fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em",
              maxWidth: 680, marginBottom: 72, color: "var(--text)",
            }}>
              Everything you need to{" "}
              <span style={{ color: "var(--text-accent)" }}>dominate</span>{" "}your market
            </h2>
          </BlockReveal>
          <div className="services-grid">
            {services.map((s, i) => (
              <BlockReveal key={i} delay={i * 60}>
                <ServiceCard icon={s.icon} title={s.title} body={s.body} />
              </BlockReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROJECTS (RESULTS) ══ */}
      <section id="projects" style={{ padding: "120px 0", background: "var(--bg)" }}>
        <div className="page-wrap" style={{ padding: 0, paddingLeft: "5%", paddingRight: "5%" }}>
          <div className="section-label">
            <span className="section-label-num">04</span>
            <span className="section-label-text">Projects</span>
            <div className="section-label-line" />
          </div>
          <BlockReveal>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 20 }}>
              <h2 style={{
                fontFamily: "var(--font)", fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
                fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em", color: "var(--text)",
              }}>
                Real results from{" "}
                <span style={{ color: "var(--text-accent)" }}>real</span> businesses
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-3)", letterSpacing: "0.05em" }}>
                Trusted by 40+ businesses nationwide
              </p>
            </div>
          </BlockReveal>
        </div>

        {/* Infinite Marquee Scene */}
        <div className="marquee-container">
          <div className="marquee-track marquee-fwd">
            {firstRow.concat(firstRow).map((t, i) => (
              <TestCard key={`row1-${i}`} tag={t.tag} quote={t.quote} name={t.name} company={t.company} initials={t.initials} />
            ))}
          </div>

          <div className="marquee-track marquee-rev">
            {secondRow.concat(secondRow).map((t, i) => (
              <TestCard key={`row2-${i}`} tag={t.tag} quote={t.quote} name={t.name} company={t.company} initials={t.initials} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="pricing" style={{ padding: "120px 5%", background: "var(--bg-surface)" }}>
        <div className="page-wrap" style={{ padding: 0 }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="section-label" style={{ justifyContent: "center" }}>
              <span className="section-label-num">05</span>
              <span className="section-label-text">Pricing</span>
            </div>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, marginBottom: 20 }}>Simple, fair pricing</h2>
            <p style={{ color: "var(--text-2)", maxWidth: 500, margin: "0 auto" }}>Choose the engine that fits your current growth stage.</p>
          </div>

          <div className="pricing-grid">
            {pricingPlans.map((p, i) => (
              <BlockReveal key={i} delay={i * 100}>
                <div className={`pricing-card ${p.popular ? "popular" : ""}`}>
                  {p.popular && <div style={{ position: "absolute", top: 12, right: 12, background: "var(--accent)", color: "var(--text)", fontSize: "0.65rem", padding: "4px 10px", borderRadius: 100, fontWeight: 700 }}>MOST POPULAR</div>}
                  <h3 className="pricing-title">{p.title}</h3>
                  <div className="pricing-price">{p.price} <span style={{ fontSize: "0.9rem", opacity: 0.6 }}>/mo</span></div>
                  <ul className="pricing-feats">
                    {p.features.map(f => (
                      <li key={f} className="pricing-feat">{f}</li>
                    ))}
                  </ul>
                  <CtaButton href="https://cal.com/niteshbandekar/15min" style={{ width: "100%", justifyContent: "center" }}>
                    Get Started
                  </CtaButton>
                </div>
              </BlockReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section id="faq" style={{ padding: "120px 5%" }}>
        <div className="page-wrap" style={{ padding: 0 }}>
          <div className="section-label">
            <span className="section-label-num">04</span>
            <span className="section-label-text">FAQ</span>
            <div className="section-label-line" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 80px", alignItems: "start" }} className="faq-inner">
            <BlockReveal>
              <h2 style={{
                fontFamily: "var(--font)", fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
                fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em",
                color: "var(--text)", position: "sticky", top: 100,
              }}>
                Questions we{" "}
                <span style={{ color: "var(--text-accent)" }}>hear</span> often
              </h2>
            </BlockReveal>
            <div>
              {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <section style={{
        padding: "140px 5%", textAlign: "center", position: "relative",
        overflow: "hidden", borderTop: "1px solid var(--border)", background: "var(--bg-surface)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "80px 80px", opacity: 0.2,
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", width: 700, height: 300, borderRadius: "50%",
          background: "radial-gradient(ellipse, var(--accent-bg) 0%, transparent 65%)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          pointerEvents: "none", filter: "blur(60px)",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <BlockReveal>
            <p style={{
              fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase",
              color: "var(--text-3)", marginBottom: 24, fontWeight: 600,
            }}>Start generating customers</p>

            <h2 className="cta-big">
              Ready to{" "}
              <span style={{ color: "var(--text-accent)" }}>fill your calendar</span>
              <br />with real customers?
            </h2>

            <p style={{ color: "var(--text-2)", fontSize: "1rem", maxWidth: 480, margin: "0 auto 52px", lineHeight: 1.8 }}>
              Free 15-minute strategy call. Get your customized 90-day acquisition plan.
            </p>

            <CtaButton href="https://cal.com/niteshbandekar/30min" style={{ marginTop: 20 }}>
              Book Your Free Strategy Call
            </CtaButton>
          </BlockReveal>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "72px 5% 0" }}>
        <div className="page-wrap" style={{ padding: 0 }}>
          <div className="footer-grid">
            <div>
              <span style={{
                fontFamily: "var(--font)", fontSize: "1.15rem", fontWeight: 700,
                color: "var(--text)", display: "block", marginBottom: 16, letterSpacing: "-0.02em",
              }}>
                NEXOL <span style={{ color: "var(--text-accent)" }}>MEDIA</span>
              </span>
              <p style={{ fontSize: "0.85rem", color: "var(--text-2)", lineHeight: 1.8, maxWidth: 260 }}>
                We build revenue engines for service businesses using content, Meta Ads, and intelligent automation.
              </p>
            </div>

            <div>
              <h4 style={{
                fontSize: "0.67rem", letterSpacing: "0.2em", textTransform: "uppercase",
                color: "var(--text-3)", marginBottom: 20, fontWeight: 600,
              }}>Navigation</h4>
              {["Process", "Benefits", "Projects", "Pricing"].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="footer-link">{l}</a>
              ))}
            </div>

            <div>
              <h4 style={{
                fontSize: "0.67rem", letterSpacing: "0.2em", textTransform: "uppercase",
                color: "var(--text-3)", marginBottom: 20, fontWeight: 600,
              }}>Services</h4>
              {["Meta Advertising", "Content Creation", "Video Editing", "Lead Generation", "Marketing Automation"].map((l) => (
                <span key={l} className="footer-link" style={{ cursor: "default" }}>{l}</span>
              ))}
            </div>

            <div>
              <h4 style={{
                fontSize: "0.67rem", letterSpacing: "0.2em", textTransform: "uppercase",
                color: "var(--text-3)", marginBottom: 20, fontWeight: 600,
              }}>Contact</h4>
              <a href="tel:+917058025578" className="footer-link">+91 705 802 5578</a>
              <a href="mailto:info@nexolmedia.com" className="footer-link">info@nexolmedia.com</a>
              <a href="https://cal.com/niteshbandekar/15min" target="_blank" rel="noreferrer" className="footer-link">Book a Call ↗</a>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid var(--border)", padding: "24px 0",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 12,
          }}>
            <p style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>© 2026 Nexol Media. All rights reserved.</p>
            <p style={{ fontSize: "0.68rem", color: "var(--text-3)", letterSpacing: "0.1em", fontFamily: "var(--font)" }}>
              META ADS · CONTENT · AUTOMATION
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
