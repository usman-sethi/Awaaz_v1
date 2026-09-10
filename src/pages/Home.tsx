import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, ArrowRight, Zap, Shield, Globe, MessageSquare, BarChart3 } from 'lucide-react';

export function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="flex min-h-[85vh] flex-col items-center justify-center py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800/60 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI-Powered Civic Complaints
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent">AWAAZ</span>
          </h1>
          <p className="mb-3 text-lg font-light sm:text-xl md:text-2xl text-zinc-400">
            Your voice, translated into action.
          </p>
          <p className="mx-auto mb-10 max-w-xl text-sm text-zinc-500 sm:text-base leading-relaxed">
            Speak your civic complaint naturally in Urdu. Awaaz uses AI to understand the issue, 
            identify the responsible department, and turn your words into an actionable complaint.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/report"
              className="group inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-all hover:bg-white hover:shadow-lg hover:shadow-zinc-100/10"
            >
              <Mic size={16} />
              Speak your complaint
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-900"
            >
              See how it works
            </Link>
          </div>
        </motion.div>

        {/* Flow Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 w-full max-w-2xl"
        >
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-0">
              {[
                { icon: '🎙️', label: 'Speak', sublabel: 'بولیں' },
                { icon: '🧠', label: 'Understand', sublabel: 'سمجھیں' },
                { icon: '🏢', label: 'Route', sublabel: 'بھیجیں' },
                { icon: '📝', label: 'Draft', sublabel: 'لکھیں' },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-4 sm:gap-0">
                  <div className="flex flex-col items-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800/50 text-xl ring-1 ring-zinc-700/50">
                      {step.icon}
                    </div>
                    <span className="text-xs font-medium text-zinc-300">{step.label}</span>
                    <span className="text-[10px] text-zinc-500 font-urdu">{step.sublabel}</span>
                  </div>
                  {i < 3 && (
                    <div className="mx-4 hidden h-px w-8 bg-gradient-to-r from-zinc-700 to-zinc-800 sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-800/50 py-20">
        <div className="mb-10 text-center">
          <h2 className="text-lg font-semibold text-zinc-200 sm:text-xl">How Awaaz works</h2>
          <p className="mt-1 text-sm text-zinc-500">From voice to actionable complaint in seconds.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <Mic size={18} />,
              title: 'Voice-first input',
              description: 'Speak naturally in Urdu. No forms, no typing. Just talk.',
            },
            {
              icon: <Zap size={18} />,
              title: 'AI-powered analysis',
              description: 'Qwen AI understands your complaint, extracts key details, and identifies the category.',
            },
            {
              icon: <Shield size={18} />,
              title: 'Smart department routing',
              description: 'Suggests the responsible department with confidence scores. You stay in control.',
            },
            {
              icon: <Globe size={18} />,
              title: 'Urdu-first experience',
              description: 'Built for Urdu speakers with proper RTL support and Nastaliq typography.',
            },
            {
              icon: <MessageSquare size={18} />,
              title: 'Dual complaint output',
              description: 'Get a formal complaint for authorities and a WhatsApp-ready message for quick sharing.',
            },
            {
              icon: <BarChart3 size={18} />,
              title: 'Civic intelligence',
              description: 'Aggregate data reveals patterns. See which issues affect your community most.',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-5 transition-all hover:border-zinc-700/50 hover:bg-zinc-900/30"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800/50 text-emerald-400 ring-1 ring-zinc-700/30">
                {feature.icon}
              </div>
              <h3 className="mb-1 text-sm font-medium text-zinc-200">{feature.title}</h3>
              <p className="text-xs leading-relaxed text-zinc-500">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-t border-zinc-800/50 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold text-zinc-200 sm:text-xl">Built on trust</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
            Awaaz never fabricates information. AI-generated drafts are clearly labeled and always editable. 
            Department suggestions come with confidence scores. You review everything before it goes anywhere.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {['No fabricated facts', 'Confidence scores', 'Always editable', 'Transparent AI'].map(tag => (
              <span key={tag} className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800/50 py-20 text-center">
        <h2 className="text-xl font-semibold text-zinc-200 sm:text-2xl">Ready to speak up?</h2>
        <p className="mt-2 text-sm text-zinc-500">Your complaint takes less than a minute.</p>
        <Link
          to="/report"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-all hover:bg-white"
        >
          <Mic size={16} />
          Start a complaint
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-8 text-center">
        <p className="text-xs text-zinc-600">
          Awaaz — AI-generated drafts. Please review before submitting to any authority.
        </p>
        <p className="mt-2 text-[10px] text-zinc-700">
          Built with Qwen AI · React · TypeScript
        </p>
      </footer>
    </main>
  );
}
