export type ComplaintStatus = 'draft' | 'ready' | 'submitted' | 'resolved';
export type ComplaintCategory = 'water' | 'electricity' | 'road' | 'pothole' | 'streetlight' | 'sanitation' | 'sewerage' | 'traffic-infrastructure' | 'public-space' | 'other';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Language = 'ur' | 'en';

export interface ComplaintAnalysis {
  language: Language;
  transcript: string;
  category: ComplaintCategory;
  department: string;
  departmentConfidence: number;
  departmentReason: string;
  location: string;
  duration: string;
  severity: Severity;
  publicSafetyImpact: boolean;
  summary: string;
  missingInformation: string[];
}

export interface GeneratedComplaint {
  subject: string;
  formalBody: string;
  whatsappMessage: string;
}

export interface Complaint {
  id: string;
  complaintId: string;
  transcript: string;
  language: Language;
  category: ComplaintCategory;
  department: string;
  departmentConfidence: number;
  departmentReason: string;
  location: string;
  duration: string;
  severity: Severity;
  publicSafetyImpact: boolean;
  summary: string;
  formalComplaint: string;
  whatsappComplaint: string;
  subject: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  totalComplaints: number;
  byCategory: Record<string, number>;
  byDepartment: Record<string, number>;
  bySeverity: Record<string, number>;
  recentComplaints: Complaint[];
  mostReportedArea: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  titleUrdu: string;
  description: string;
  transcript: string;
  analysis: ComplaintAnalysis;
  generated: GeneratedComplaint;
}
