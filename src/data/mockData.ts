import { formatISO, subDays, addDays } from 'date-fns';
import type {
  AuditEvent,
  CertificateRecord,
  RoleDefinition,
  TreatmentPlanRecord,
} from '../types';

const now = new Date();
const fmt = (date: Date) => formatISO(date, { representation: 'complete' });

export const certificateRecords: CertificateRecord[] = [
  {
    id: 'CERT-001',
    userName: 'CPT Maria Lopez',
    rank: 'CPT',
    unit: '807th MED BDE',
    roleRequested: 'Medical Readiness Coordinator',
    status: 'pending',
    uploadedAt: fmt(subDays(now, 1)),
    expiresAt: fmt(addDays(now, 330)),
    type: 'HIPAA',
    ocrExtractedExpiry: fmt(addDays(now, 330)),
    ocrConfidence: 0.92,
    fileName: 'Lopez_MRC_HIPAA.pdf',
  },
  {
    id: 'CERT-002',
    userName: 'MSG Daniel Richards',
    rank: 'MSG',
    unit: '63rd RD',
    roleRequested: 'Dental Tech',
    status: 'updated',
    uploadedAt: fmt(subDays(now, 4)),
    expiresAt: fmt(addDays(now, 150)),
    type: 'HIPAA',
    ocrExtractedExpiry: fmt(addDays(now, 150)),
    ocrConfidence: 0.88,
    fileName: 'Richards_DentalTech_HIPAA.pdf',
    notes: 'Previously expired; awaiting reinstatement approval.',
  },
  {
    id: 'CERT-003',
    userName: 'Dr. Rebecca Imam',
    rank: 'CIV',
    unit: 'Contract Dentist - QTC',
    roleRequested: 'Dentist',
    status: 'expired',
    uploadedAt: fmt(subDays(now, 380)),
    expiresAt: fmt(subDays(now, 15)),
    type: 'License',
    ocrConfidence: 0.67,
    fileName: 'Imam_License.pdf',
    notes: 'OCR detected mismatch between expiration and provided date.',
  },
  {
    id: 'CERT-004',
    userName: '1LT Avery Chen',
    rank: '1LT',
    unit: '420th MMB',
    roleRequested: 'Dentist',
    status: 'pending',
    uploadedAt: fmt(subDays(now, 2)),
    expiresAt: fmt(addDays(now, 365)),
    type: 'HIPAA',
    ocrExtractedExpiry: fmt(addDays(now, 365)),
    ocrConfidence: 0.97,
    fileName: 'Chen_Dentist_HIPAA.pdf',
    notes: 'Requires dental license verification.',
  },
  {
    id: 'CERT-005',
    userName: 'SGT Elijah Ward',
    rank: 'SGT',
    unit: 'Army Reserve Medical Command',
    roleRequested: 'Treatment Plan Coordinator',
    status: 'approved',
    uploadedAt: fmt(subDays(now, 20)),
    expiresAt: fmt(addDays(now, 310)),
    type: 'HIPAA',
    ocrExtractedExpiry: fmt(addDays(now, 310)),
    ocrConfidence: 0.93,
    reviewer: 'COL Oates',
    lastReviewedAt: fmt(subDays(now, 18)),
    fileName: 'Ward_TPC_HIPAA.pdf',
  },
];

export const treatmentPlans: TreatmentPlanRecord[] = [
  {
    id: 'TP-10234',
    soldierName: 'SSG Howard Mills',
    dodId: '128-44-9312',
    unit: '807th MED BDE',
    provider: 'Dr. Selena Park',
    status: 'awaiting-approval',
    currentCategory: '3C',
    previousCategory: '3B',
    originalApprover: 'MAJ Trenton Reid',
    submittedAt: fmt(subDays(now, 1)),
    lastUpdatedAt: fmt(subDays(now, 1)),
    requiresReapproval: true,
    changeSummary:
      'Added three crown procedures (ADA 2750) during soldier consult on 26 Oct.',
    delta: {
      id: 'DELTA-9001',
      description: 'Upgrade to 3C due to additional restorative work.',
      addedProcedures: ['ADA 2750 x3', 'ADA D2950'],
      removedProcedures: [],
      financialImpact: '$3,450 estimated contract increase',
    },
    riskNotes:
      'Billing reconciliation required; ensure previously approved 3B items remain in scope.',
  },
  {
    id: 'TP-10251',
    soldierName: 'SPC Lindsay Moore',
    dodId: '159-82-3401',
    unit: '81st RD',
    provider: 'Dr. Ahmed Farouk',
    status: 'in-review',
    currentCategory: '3C',
    previousCategory: '3A',
    originalApprover: 'CPT Ernest Baird',
    submittedAt: fmt(subDays(now, 2)),
    lastUpdatedAt: fmt(subDays(now, 1)),
    requiresReapproval: true,
    changeSummary:
      'Added surgical extraction due to infection; flagged urgent follow-up.',
    delta: {
      id: 'DELTA-9002',
      description: 'Category escalation due to urgent extraction.',
      addedProcedures: ['ADA D7210', 'ADA D9610 (anesthesia)'],
      removedProcedures: [],
      financialImpact: '$1,250 estimated contract increase',
    },
    riskNotes: 'Notify billing contractor of urgent classification change.',
  },
  {
    id: 'TP-10087',
    soldierName: 'CPL Sydney Patel',
    dodId: '112-55-1876',
    unit: '3rd MED CMD',
    provider: 'Dr. Liam Rogers',
    status: 'awaiting-approval',
    currentCategory: '3C',
    previousCategory: '3C',
    originalApprover: 'COL Oates',
    submittedAt: fmt(subDays(now, 5)),
    lastUpdatedAt: fmt(subDays(now, 2)),
    requiresReapproval: true,
    changeSummary:
      'Provider removed periodontal maintenance that was already billed; needs reconciliation.',
    delta: {
      id: 'DELTA-9003',
      description: 'Plan modified post-billing; remove duplicate maintenance.',
      addedProcedures: [],
      removedProcedures: ['ADA D4910'],
      financialImpact: '$450 credit pending confirmation',
    },
    riskNotes:
      'Ensure contractor reverses previous billing; audit log should capture removal.',
  },
];

export const auditEvents: AuditEvent[] = [
  {
    id: 'AUD-5001',
    objectType: 'certificate',
    objectId: 'CERT-002',
    action: 'UPLOAD_REPLACEMENT',
    timestamp: fmt(subDays(now, 4)),
    actor: 'MSG Daniel Richards',
    details: 'Uploaded new HIPAA certificate after expiry lockout.',
    diff: {
      status: { previous: 'expired', current: 'updated' },
      expiresAt: {
        previous: fmt(subDays(now, 30)),
        current: fmt(addDays(now, 150)),
      },
    },
  },
  {
    id: 'AUD-5002',
    objectType: 'treatment-plan',
    objectId: 'TP-10234',
    action: 'CATEGORY_ESCALATION',
    timestamp: fmt(subDays(now, 1)),
    actor: 'Dr. Selena Park',
    details: 'Escalated treatment plan from 3B to 3C after additional findings.',
    diff: {
      category: { previous: '3B', current: '3C' },
      procedures: { previous: '4 total', current: '7 total' },
    },
    riskLevel: 'high',
  },
  {
    id: 'AUD-5003',
    objectType: 'role',
    objectId: 'ROLE-DENTIST',
    action: 'PERMISSION_UPDATE',
    timestamp: fmt(subDays(now, 3)),
    actor: 'COL Oates',
    details: 'Enabled billing reconciliation view for Dentist role.',
    diff: {
      permissions: {
        previous: 'VIEW_BILLING=disabled',
        current: 'VIEW_BILLING=enabled',
      },
    },
    riskLevel: 'medium',
  },
];

export const roleDefinitions: RoleDefinition[] = [
  {
    id: 'ROLE-MRC',
    name: 'Medical Readiness Coordinator',
    description:
      'Manages soldier medical readiness artifacts, uploads 2813s, and views readiness reports.',
    requiredCredentials: ['HIPAA certificate'],
    permissions: [
      {
        id: 'VIEW_DASHBOARD',
        label: 'View readiness dashboard',
        description:
          'Allows access to medical readiness overview and export readiness summaries.',
      },
      {
        id: 'UPLOAD_2813',
        label: 'Upload DD Form 2813',
        description:
          'Authorizes upload and management of soldier dental readiness forms.',
      },
      {
        id: 'RUN_REPORTS',
        label: 'Run readiness reports',
        description: 'Allows execution of DenClass Reports module queries.',
      },
    ],
    defaultReports: [
      'DenClass Reports - ESR - Event Summary',
      'DenClass Reports - PTP Report',
    ],
    sensitiveActions: ['None'],
  },
  {
    id: 'ROLE-DENTIST',
    name: 'Dentist',
    description:
      'Clinical provider with authority to create and modify treatment plans up to 3B.',
    requiredCredentials: ['HIPAA certificate', 'Active dental license'],
    permissions: [
      {
        id: 'CREATE_TREATMENT_PLAN',
        label: 'Create / update treatment plans',
        description: 'Allows entry and modification of dental treatment plans.',
      },
      {
        id: 'UPLOAD_DOCUMENTS',
        label: 'Upload SF 603 / documentation',
        description: 'Allows providers to upload soldier treatment documents.',
      },
      {
        id: 'VIEW_BILLING',
        label: 'View billing reconciliation',
        description:
          'Grants insight into contractor billing tied to treatment plans.',
      },
    ],
    defaultReports: [
      'DenClass Reports - SF 603 Report',
      'DenClass Reports - DWS Report',
    ],
    sensitiveActions: ['Modify treatment plan post-approval'],
    impersonationNotes:
      'Impersonation mode should disable edits and log access for audit.',
  },
  {
    id: 'ROLE-DRC3C',
    name: 'DRC 3C Approver',
    description:
      'Senior authority responsible for approving or rejecting the highest-cost (3C) treatment plans.',
    requiredCredentials: [
      'HIPAA certificate',
      'DRC 3C approval appointment memo',
    ],
    permissions: [
      {
        id: 'APPROVE_3C',
        label: 'Approve DRC 3C treatment plans',
        description:
          'Allows approval/return of 3C plans and requires audit confirmation.',
      },
      {
        id: 'VIEW_AUDIT_LOG',
        label: 'View audit trail',
        description:
          'Provides direct access to full audit history for treatment plans.',
      },
      {
        id: 'MANAGE_ROLES',
        label: 'Manage role assignments',
        description: 'Allows assignment of permissions to users.',
      },
    ],
    defaultReports: ['DenClass Reports - ESR - Event Summary - Soldier Exam'],
    sensitiveActions: ['Approve 3C', 'Delegate approval authority'],
  },
];
