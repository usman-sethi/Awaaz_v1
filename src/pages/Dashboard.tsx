import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, AlertTriangle, MapPin, Building2 } from 'lucide-react';
import { DashboardData } from '../types/complaint';
import { getDashboardData } from '../lib/storage';
import { getCategoryConfig } from '../lib/categories';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isDemoData, setIsDemoData] = useState(false);

  useEffect(() => {
    const dashboardData = getDashboardData();
    setData(dashboardData);
    // Check if it's demo data (total is 47 from demo)
    setIsDemoData(dashboardData.totalComplaints === 47 && dashboardData.recentComplaints.length === 0);
  }, []);

  if (!data) return null;

  const categoryData = Object.entries(data.byCategory).map(([key, value]) => ({
    name: getCategoryConfig(key as any).label,
    value,
    icon: getCategoryConfig(key as any).icon,
  }));

  const departmentData = Object.entries(data.byDepartment).map(([name, value]) => ({ name, value }));

  const severityData = Object.entries(data.bySeverity).map(([name, value]) => ({ name, value }));

  const severityColors: Record<string, string> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#f97316',
    critical: '#ef4444',
  };

  const chartColors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100 sm:text-2xl">Civic Intelligence</h1>
            <p className="mt-1 text-xs text-zinc-500">Aggregate complaint data and trends</p>
          </div>
          {isDemoData && (
            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-400">
              Demo data
            </span>
          )}
        </div>

        {/* Metric Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Complaints"
            value={data.totalComplaints.toString()}
            icon={<BarChart3 size={16} />}
          />
          <MetricCard
            label="Most Reported Area"
            value={data.mostReportedArea}
            icon={<MapPin size={16} />}
          />
          <MetricCard
            label="Departments Involved"
            value={Object.keys(data.byDepartment).length.toString()}
            icon={<Building2 size={16} />}
          />
          <MetricCard
            label="High/Critical"
            value={`${(data.bySeverity.high || 0) + (data.bySeverity.critical || 0)}`}
            icon={<AlertTriangle size={16} />}
            accent
          />
        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* By Category */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">By Category</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} fillOpacity={0.7} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* By Department */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">By Department</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="value"
                    stroke="none"
                  >
                    {departmentData.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} fillOpacity={0.8} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {departmentData.map((d, i) => (
                <span key={d.name} className="inline-flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartColors[i % chartColors.length] }} />
                  {d.name}
                </span>
              ))}
            </div>
          </div>

          {/* Severity Distribution */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Severity Distribution</h3>
            <div className="space-y-3">
              {severityData.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="w-14 text-xs capitalize text-zinc-400">{item.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(item.value / data.totalComplaints) * 100}%`,
                        backgroundColor: severityColors[item.name] || '#71717a',
                      }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs text-zinc-500">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Recent Complaints</h3>
            {data.recentComplaints.length > 0 ? (
              <div className="space-y-2">
                {data.recentComplaints.map(c => (
                  <div key={c.id} className="flex items-center justify-between rounded-md bg-zinc-800/30 px-3 py-2">
                    <div>
                      <p className="text-xs text-zinc-300">{c.summary}</p>
                      <p className="text-[10px] text-zinc-600">{c.complaintId} · {c.department}</p>
                    </div>
                    <span className="text-[10px] text-zinc-500">{getCategoryConfig(c.category).icon}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-600">No complaints recorded yet. Submit one to see it here.</p>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}

function MetricCard({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-4">
      <div className="flex items-center gap-2">
        <span className={accent ? 'text-red-400' : 'text-zinc-500'}>{icon}</span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">{label}</span>
      </div>
      <p className={`mt-2 text-xl font-semibold ${accent ? 'text-red-400' : 'text-zinc-100'}`}>{value}</p>
    </div>
  );
}
