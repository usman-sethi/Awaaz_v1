import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, Edit3, Download, Save, ArrowLeft } from 'lucide-react';
import { ComplaintAnalysis, GeneratedComplaint, Complaint } from '../types/complaint';
import { getCategoryConfig } from '../lib/categories';
import { saveComplaint } from '../lib/storage';

export function Result() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<ComplaintAnalysis | null>(null);
  const [generated, setGenerated] = useState<GeneratedComplaint | null>(null);
  const [copiedFormal, setCopiedFormal] = useState(false);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [saved, setSaved] = useState(false);
  const [savedComplaint, setSavedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('awaaz-current');
    if (data) {
      const parsed = JSON.parse(data);
      setAnalysis(parsed.analysis);
      setGenerated(parsed.generated);
      setEditText(parsed.generated.formalBody);
    } else {
      navigate('/report');
    }
  }, [navigate]);

  const copyToClipboard = async (text: string, type: 'formal' | 'whatsapp') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'formal') { setCopiedFormal(true); setTimeout(() => setCopiedFormal(false), 2000); }
      else { setCopiedWhatsapp(true); setTimeout(() => setCopiedWhatsapp(false), 2000); }
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (type === 'formal') { setCopiedFormal(true); setTimeout(() => setCopiedFormal(false), 2000); }
      else { setCopiedWhatsapp(true); setTimeout(() => setCopiedWhatsapp(false), 2000); }
    }
  };

  const handleSave = () => {
    if (!analysis || !generated) return;
    const complaint = saveComplaint({
      transcript: analysis.transcript,
      language: analysis.language,
      category: analysis.category,
      department: analysis.department,
      departmentConfidence: analysis.departmentConfidence,
      departmentReason: analysis.departmentReason,
      location: analysis.location,
      duration: analysis.duration,
      severity: analysis.severity,
      publicSafetyImpact: analysis.publicSafetyImpact,
      summary: analysis.summary,
      formalComplaint: editing ? editText : generated.formalBody,
      whatsappComplaint: generated.whatsappMessage,
      subject: generated.subject,
      status: 'ready',
    });
    setSavedComplaint(complaint);
    setSaved(true);
  };

  const handleDownload = () => {
    if (!generated) return;
    const text = editing ? editText : generated.formalBody;
    const blob = new Blob([`Subject: ${generated.subject}\n\n${text}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaint-${savedComplaint?.complaintId || 'draft'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!analysis || !generated) return null;

  const categoryConfig = getCategoryConfig(analysis.category);
  const confidencePercent = Math.round(analysis.departmentConfidence * 100);

  const severityColors: Record<string, string> = {
    low: 'text-emerald-400 bg-emerald-500/10',
    medium: 'text-amber-400 bg-amber-500/10',
    high: 'text-orange-400 bg-orange-500/10',
    critical: 'text-red-400 bg-red-500/10',
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {/* Back button */}
        <button
          onClick={() => navigate('/report')}
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft size={12} /> New complaint
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-zinc-100 sm:text-2xl">AI understood your complaint</h1>
          <p className="mt-1 text-xs text-zinc-500">Review the analysis below and generate your complaint.</p>
        </div>

        {/* Analysis Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: 'Issue', value: `${categoryConfig.icon} ${categoryConfig.label}`, icon: '' },
            { label: 'Location', value: analysis.location || 'Not specified', icon: '📍' },
            { label: 'Duration', value: analysis.duration || 'Not specified', icon: '⏱' },
            { label: 'Severity', value: analysis.severity, icon: '', customClass: severityColors[analysis.severity] },
            { label: 'Department', value: analysis.department, icon: '🏢' },
            { label: 'Confidence', value: `${confidencePercent}%`, icon: '' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-3.5"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">{card.label}</p>
              <p className={`mt-1 text-sm font-medium capitalize ${card.customClass || 'text-zinc-200'}`}>
                {card.icon && <span className="mr-1">{card.icon}</span>}
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Department confidence note */}
        {confidencePercent < 70 && (
          <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-400">
            We're not fully certain who handles this complaint. You can change the department manually.
          </div>
        )}

        {/* Transcript */}
        <div className="mt-6 rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-4">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">Transcript</p>
          <p className="text-sm text-zinc-300 font-urdu leading-relaxed">{analysis.transcript}</p>
        </div>

        {/* Summary */}
        <div className="mt-3 rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-4">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">Summary</p>
          <p className="text-sm text-zinc-300">{analysis.summary}</p>
        </div>

        {/* Public Safety */}
        {analysis.publicSafetyImpact && (
          <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">
            ⚠️ This complaint may have public safety implications.
          </div>
        )}

        {/* Formal Complaint */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-200">Formal Complaint</h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setEditing(!editing)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
              >
                <Edit3 size={12} /> {editing ? 'Done' : 'Edit'}
              </button>
              <button
                onClick={() => copyToClipboard(editing ? editText : generated.formalBody, 'formal')}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
              >
                {copiedFormal ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copiedFormal ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
              >
                <Download size={12} /> Download
              </button>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-4">
            <p className="mb-2 text-xs font-medium text-zinc-400">{generated.subject}</p>
            {editing ? (
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                className="w-full min-h-[200px] resize-y rounded-md border border-zinc-700 bg-zinc-800/50 p-3 text-sm text-zinc-300 outline-none focus:border-emerald-500/50"
              />
            ) : (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                {generated.formalBody}
              </p>
            )}
          </div>
        </div>

        {/* WhatsApp Message */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-200">WhatsApp-ready message</h2>
            <button
              onClick={() => copyToClipboard(generated.whatsappMessage, 'whatsapp')}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            >
              {copiedWhatsapp ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copiedWhatsapp ? 'Copied' : 'Copy message'}
            </button>
          </div>
          <div className="mt-3 rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{generated.whatsappMessage}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleSave}
            disabled={saved}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              saved
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-zinc-100 text-zinc-900 hover:bg-white'
            }`}
          >
            {saved ? (
              <><Check size={14} /> Saved as {savedComplaint?.complaintId}</>
            ) : (
              <><Save size={14} /> Save Complaint</>
            )}
          </button>
          <button
            onClick={() => navigate('/history')}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800"
          >
            View History
          </button>
        </div>

        {/* Trust */}
        <p className="mt-6 text-center text-[11px] text-zinc-600">
          AI-generated draft. Please review before submitting to any authority.
        </p>
      </motion.div>
    </main>
  );
}
