import { Complaint, DashboardData } from '../types/complaint';

const STORAGE_KEY = 'awaaz-complaints';
const COUNTER_KEY = 'awaaz-counter';

function getCounter(): number {
  const val = localStorage.getItem(COUNTER_KEY);
  return val ? parseInt(val, 10) : 1000;
}

function incrementCounter(): number {
  const next = getCounter() + 1;
  localStorage.setItem(COUNTER_KEY, next.toString());
  return next;
}

export function generateComplaintId(): string {
  const num = incrementCounter();
  return `AW-${num}`;
}

export function saveComplaint(complaint: Omit<Complaint, 'id' | 'complaintId' | 'createdAt' | 'updatedAt'>): Complaint {
  const existing = getAllComplaints();
  const now = new Date().toISOString();
  const newComplaint: Complaint = {
    ...complaint,
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    complaintId: generateComplaintId(),
    createdAt: now,
    updatedAt: now,
  };
  existing.unshift(newComplaint);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return newComplaint;
}

export function updateComplaint(id: string, updates: Partial<Complaint>): Complaint | null {
  const existing = getAllComplaints();
  const idx = existing.findIndex(c => c.id === id);
  if (idx === -1) return null;
  existing[idx] = { ...existing[idx], ...updates, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return existing[idx];
}

export function getComplaint(id: string): Complaint | null {
  return getAllComplaints().find(c => c.id === id) || null;
}

export function getAllComplaints(): Complaint[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getDashboardData(): DashboardData {
  const complaints = getAllComplaints();
  
  if (complaints.length === 0) {
    return getDemoDashboardData();
  }

  const byCategory: Record<string, number> = {};
  const byDepartment: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  const locationCount: Record<string, number> = {};

  complaints.forEach(c => {
    byCategory[c.category] = (byCategory[c.category] || 0) + 1;
    byDepartment[c.department] = (byDepartment[c.department] || 0) + 1;
    bySeverity[c.severity] = (bySeverity[c.severity] || 0) + 1;
    if (c.location) {
      locationCount[c.location] = (locationCount[c.location] || 0) + 1;
    }
  });

  const mostReportedArea = Object.entries(locationCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return {
    totalComplaints: complaints.length,
    byCategory,
    byDepartment,
    bySeverity,
    recentComplaints: complaints.slice(0, 5),
    mostReportedArea,
  };
}

function getDemoDashboardData(): DashboardData {
  return {
    totalComplaints: 47,
    byCategory: { water: 12, electricity: 9, streetlight: 8, road: 7, sanitation: 6, pothole: 3, sewerage: 2 },
    byDepartment: { TMA: 18, WASA: 12, PESCO: 9, 'Traffic Police': 5, 'Highways Department': 3 },
    bySeverity: { low: 8, medium: 22, high: 12, critical: 5 },
    recentComplaints: [],
    mostReportedArea: 'University Town',
  };
}
