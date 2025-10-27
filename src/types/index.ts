export type CertificateStatus =
  | 'pending'
  | 'updated'
  | 'expired'
  | 'approved'
  | 'rejected';

export interface CertificateRecord {
  id: string;
  userName: string;
  rank: string;
  unit: string;
  roleRequested: string;
  status: CertificateStatus;
  uploadedAt: string;
  expiresAt: string;
  type: 'HIPAA' | 'DoDI 6025.19' | 'License';
  ocrExtractedExpiry?: string;
  ocrConfidence?: number;
  reviewer?: string;
  lastReviewedAt?: string;
  notes?: string;
  fileName: string;
}

export type TreatmentPlanCategory = '3A' | '3B' | '3C';

export interface TreatmentPlanDelta {
  id: string;
  description: string;
  addedProcedures: string[];
  removedProcedures: string[];
  financialImpact: string;
}

export interface TreatmentPlanRecord {
  id: string;
  soldierName: string;
  dodId: string;
  unit: string;
  provider: string;
  status: 'awaiting-approval' | 'in-review' | 'approved' | 'returned';
  currentCategory: TreatmentPlanCategory;
  previousCategory?: TreatmentPlanCategory;
  originalApprover?: string;
  submittedAt: string;
  lastUpdatedAt: string;
  requiresReapproval: boolean;
  changeSummary: string;
  delta: TreatmentPlanDelta;
  riskNotes?: string;
}

export interface AuditEvent {
  id: string;
  objectType: 'certificate' | 'treatment-plan' | 'role' | 'user';
  objectId: string;
  action: string;
  timestamp: string;
  actor: string;
  details: string;
  diff?: Record<string, { previous: string | null; current: string | null }>;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface PermissionItem {
  id: string;
  label: string;
  description: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  requiredCredentials: string[];
  permissions: PermissionItem[];
  defaultReports: string[];
  sensitiveActions: string[];
  impersonationNotes?: string;
}

export interface QueueMetrics {
  pendingRegistrations: number;
  updatedCertificates: number;
  expiredCertificates: number;
  treatmentPlansAwaiting: number;
  highRiskAlerts: number;
}

export interface Notification {
  id: string;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  autoHideDuration?: number;
}
