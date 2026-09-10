import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Building2, ChevronRight, FileText } from 'lucide-react';
import { Complaint } from '../types/complaint';
import { getAllComplaints } from '../lib/storage';
import { getCategoryConfig } from '../lib/categories';
import { format } from 'date-fns';

export function History() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selected, setSelected] = useState<Complaint | null>(null);

  useEffect(() => {
    setComplaints(getAllComplaints());
  }, []);

  const statusColors: Record<string, string> = {
    draft: 'text-zinc-400 bg-zinc-800',
    ready: 'text-emerald-400 bg-emerald-500/10',
    submitted: 'text-blue-400 bg-blue-500/10',
    resolved: 'text-zinc-300 bg-zinc-700',
  };

  if (complaints.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-800/50">
            <FileText size={24} className="text-zinc-600" />
          </div>
          <h1 className="mt-4 text-lg font-medium text-zinc-200">No complaints yet</h1>
          <p className="mt-1 text-sm text-zinc-500">Your saved complaints will appear here.</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-1 text-xl font-semibold text-zinc-100 sm:text-2xl">Complaint History</h1>
        <p className="mb-6 text-xs text-zinc-500">{complaints.length} complaint{complaints.length !== 1 ? 's' : ''} recorded</p>

        <div className="space-y-2">
          {complaints.map((complaint, i) => {
            const cat = getCategoryConfig(complaint.category);
            return (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <button
                  onClick={() => setSelected(selected?.id === complaint.id ? null : complaint)}
                  className="w-full rounded-lg border border-zinc-800/60 bg-zinc-900/20 p-4 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900/40"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-500">{complaint.complaintId}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusColors[complaint.status]}`}>
                          {complaint.status}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm font-medium text-zinc-200">{complaint.summary}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                        <span className="inline-flex items-center gap-1">{cat.icon} {cat.label}</span>
                        {complaint.location && (
                          <span className="inline-flex items-center gap-1"><MapPin size={10} /> {complaint.location}</span>
                        )}
                        <span className="inline-flex items-center gap-1"><Building2 size={10} /> {complaint.department}</span>
                        <span className="inline-flex items-center gap-1"><Clock size={10} /> {format(new Date(complaint.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className={`mt-1 text-zinc-600 transition-transform ${selected?.id === complaint.id ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {selected?.id === complaint.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-b-lg border border-t-0 border-zinc-800/60 bg-zinc-900/10 p-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">Transcript</p>
                          <p className="mt-1 text-sm text-zinc-400 font-urdu leading-relaxed">{complaint.transcript}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">Formal Complaint</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-300">{complaint.formalComplaint}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">WhatsApp Message</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-300">{complaint.whatsappComplaint}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </main>
  );
}
