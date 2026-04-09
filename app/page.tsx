import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-lg mx-auto w-full">
        <span className="font-display font-bold text-lg text-[#f0ede8] tracking-tight">
          AI Workout
        </span>
        <Link
          href="/auth/login"
          className="text-sm text-[#6b6b6b] hover:text-[#f0ede8] transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-lg mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 bg-[#c8f060]/10 border border-[#c8f060]/20 rounded-full px-3 py-1 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c8f060] animate-pulse" />
          <span className="text-xs font-display font-bold text-[#c8f060] tracking-widest uppercase">
            AI-Powered
          </span>
        </div>

        <h1 className="font-display font-bold text-4xl leading-tight text-[#f0ede8] mb-4">
          Your personal trainer,
          <br />
          <span className="text-[#c8f060]">built by AI.</span>
        </h1>

        <p className="text-[#6b6b6b] text-base leading-relaxed mb-10 max-w-sm">
          Enter your stats, goals, and injury history. Get a complete 12-week
          programme — exercises, stretching, and nutrition — personalised just
          for you.
        </p>

        <Link
          href="/auth/register"
          className="w-full bg-[#c8f060] text-[#0a0a0a] font-display font-bold text-base rounded-2xl py-4 text-center block hover:bg-[#b8e050] transition-colors"
        >
          Get my free plan
        </Link>

        <p className="text-[#6b6b6b] text-xs mt-4">
          No credit card required
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mt-16 w-full text-left">
          {[
            {
              icon: "🏋️",
              title: "12-Week Programme",
              desc: "3 progressive phases that adapt to your experience and goals.",
            },
            {
              icon: "🦴",
              title: "Injury-Aware",
              desc: "Every exercise adapted around your injuries. No guessing.",
            },
            {
              icon: "🥗",
              title: "Nutrition Targets",
              desc: "Personalised macros and meal timing for workout and rest days.",
            },
            {
              icon: "📱",
              title: "Install to Home Screen",
              desc: "Works like a native app on iPhone and Android.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4 flex gap-4 items-start"
            >
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="font-display font-bold text-sm text-[#f0ede8]">
                  {f.title}
                </p>
                <p className="text-xs text-[#6b6b6b] mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-6 text-xs text-[#6b6b6b]">
        Built with Claude AI
      </footer>
    </main>
  );
}
