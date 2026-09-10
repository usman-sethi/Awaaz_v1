import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { getDemoScenarios } from '../lib/demo';
import { getCategoryConfig } from '../lib/categories';

export function Demo() {
  const navigate = useNavigate();
  const scenarios = getDemoScenarios();
  const [activeScenario, setActiveScenario] = useState(0);

  const handleRunDemo = () => {
    const scenario = scenarios[activeScenario];
    sessionStorage.setItem('awaaz-current', JSON.stringify({
      analysis: scenario.analysis,
      generated: scenario.generated,
    }));
    navigate('/report/result');
  };

  const current = scenarios[activeScenario];
  const categoryConfig = getCategoryConfig(current.analysis.category);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          DEMO MODE
        </div>
        <h1 className="mt-3 text-xl font-semibold text-zinc-100 sm:text-2xl">Try Awaaz with sample scenarios</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Select a scenario to see how Awaaz processes a real complaint.
        </p>

        {/* Scenario Selection */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {scenarios.map((scenario, i) => {
            const cat = getCategoryConfig(scenario.analysis.category);
            return (
              <button
                key={scenario.id}
                onClick={() => setActiveScenario(i)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  activeScenario === i
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-zinc-800/60 bg-zinc-900/20 hover:border-zinc-700'
                }`}
              >
                <div className="mb-2 text-xl">{cat.icon}</div>
                <p className="text-sm font-medium text-zinc-200">{scenario.title}</p>
                <p className="mt-0.5 text-xs text-zinc-500 font-urdu">{scenario.titleUrdu}</p>
                <p className="mt-2 text-[11px] text-zinc-600">{scenario.description}</p>
              </button>
            );
          })}
        </div>

        {/* Preview */}
        <motion.div
          key={activeScenario}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5 sm:p-6"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Input */}
            <div>
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">Spoken Complaint</p>
              <p className="text-sm text-zinc-300 font-urdu leading-relaxed">{current.transcript}</p>
            </div>

            {/* Analysis */}
            <div>
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">AI Analysis</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Category</span>
                  <span className="text-zinc-300">{categoryConfig.icon} {categoryConfig.label}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Department</span>
                  <span className="text-zinc-300">{current.analysis.department}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Confidence</span>
                  <span className="text-zinc-300">{Math.round(current.analysis.departmentConfidence * 100)}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Location</span>
                  <span className="text-zinc-300">{current.analysis.location || 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Severity</span>
                  <span className="text-zinc-300 capitalize">{current.analysis.severity}</span>
                </div>
                {current.analysis.missingInformation.length > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Missing</span>
                    <span className="text-amber-400">{current.analysis.missingInformation.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Generated */}
          <div className="mt-5 border-t border-zinc-800 pt-5">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">Generated Complaint</p>
            <p className="text-xs font-medium text-zinc-400">{current.generated.subject}</p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500 line-clamp-4">
              {current.generated.formalBody}
            </p>
          </div>

          {/* Action */}
          <button
            onClick={handleRunDemo}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-all hover:bg-white"
          >
            <Play size={14} /> Run this scenario
            <ArrowRight size={14} />
          </button>
        </motion.div>

        {/* Note */}
        <p className="mt-6 text-center text-[11px] text-zinc-600">
          Demo scenarios use deterministic responses. In production, AI processes real audio input.
        </p>
      </motion.div>
    </main>
  );
}
