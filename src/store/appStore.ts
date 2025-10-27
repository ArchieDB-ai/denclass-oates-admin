import { formatISO } from 'date-fns';
import { create } from 'zustand';
import {
  auditEvents as initialAuditEvents,
  certificateRecords as initialCertificates,
  roleDefinitions,
  treatmentPlans as initialTreatmentPlans,
} from '../data/mockData';
import type {
  AuditEvent,
  CertificateRecord,
  CertificateStatus,
  Notification,
  RoleDefinition,
  TreatmentPlanRecord,
} from '../types';

interface AppState {
  certificates: CertificateRecord[];
  treatmentPlans: TreatmentPlanRecord[];
  auditEvents: AuditEvent[];
  roles: RoleDefinition[];
  notifications: Notification[];
  approveCertificate: (id: string, reviewer: string, notes?: string) => void;
  rejectCertificate: (id: string, reviewer: string, notes: string) => void;
  updateCertificateStatus: (
    id: string,
    status: CertificateStatus,
    reviewer: string,
    notes?: string,
  ) => void;
  markTreatmentPlanReviewed: (
    id: string,
    approver: string,
    decision: 'approved' | 'returned',
    notes?: string,
  ) => void;
  addAuditEvent: (event: AuditEvent) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const createId = () => Math.random().toString(36).slice(2, 10);

export const useAppStore = create<AppState>((set, get) => ({
  certificates: initialCertificates,
  treatmentPlans: initialTreatmentPlans,
  auditEvents: initialAuditEvents,
  roles: roleDefinitions,
  notifications: [],

  approveCertificate: (id, reviewer, notes) => {
    get().updateCertificateStatus(id, 'approved', reviewer, notes);
  },

  rejectCertificate: (id, reviewer, notes) => {
    get().updateCertificateStatus(id, 'rejected', reviewer, notes);
  },

  updateCertificateStatus: (id, status, reviewer, notes) => {
    const timestamp = formatISO(new Date());
    set((state) => {
      const certificates = state.certificates.map((certificate) =>
        certificate.id === id
          ? {
              ...certificate,
              status,
              reviewer,
              lastReviewedAt: timestamp,
              notes: notes ?? certificate.notes,
            }
          : certificate,
      );

      const updatedCertificate = certificates.find(
        (certificate) => certificate.id === id,
      );

      const audit: AuditEvent | undefined = updatedCertificate
        ? {
            id: `AUD-${createId()}`,
            objectType: 'certificate',
            objectId: id,
            action: `STATUS_${status.toUpperCase()}`,
            timestamp,
            actor: reviewer,
            details: `Certificate ${id} marked as ${status} by ${reviewer}.`,
            diff: {
              status: {
                previous:
                  state.certificates.find((certificate) => certificate.id === id)
                    ?.status ?? null,
                current: status,
              },
            },
          }
        : undefined;

      return {
        certificates,
        auditEvents: audit
          ? [audit, ...state.auditEvents]
          : state.auditEvents,
      };
    });

    get().addNotification({
      message: `Certificate ${id} marked as ${status}.`,
      severity: status === 'rejected' ? 'warning' : 'success',
    });
  },

  markTreatmentPlanReviewed: (id, approver, decision, notes) => {
    const timestamp = formatISO(new Date());
    set((state) => {
      const nextStatus: TreatmentPlanRecord['status'] =
        decision === 'approved' ? 'approved' : 'returned';

      const treatmentPlans = state.treatmentPlans.map((plan) => {
        if (plan.id !== id) {
          return plan;
        }
        return {
          ...plan,
          status: nextStatus,
          requiresReapproval: false,
          lastUpdatedAt: timestamp,
          riskNotes: notes ?? plan.riskNotes,
        };
      });

      const previousStatus =
        state.treatmentPlans.find((plan) => plan.id === id)?.status ??
        'awaiting-approval';

      const audit: AuditEvent = {
        id: `AUD-${createId()}`,
        objectType: 'treatment-plan',
        objectId: id,
        action: `REVIEW_${decision.toUpperCase()}`,
        timestamp,
        actor: approver,
        details: `Treatment plan ${id} ${decision} by ${approver}.`,
        diff: {
          status: {
            previous: previousStatus,
            current: nextStatus,
          },
        },
      };

      return {
        treatmentPlans,
        auditEvents: [audit, ...state.auditEvents],
      };
    });

    get().addNotification({
      message: `Treatment plan ${id} ${decision}.`,
      severity: decision === 'approved' ? 'success' : 'info',
    });
  },

  addAuditEvent: (event) =>
    set((state) => ({
      auditEvents: [event, ...state.auditEvents],
    })),

  addNotification: (notification) => {
    const id = `NTF-${createId()}`;
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id, autoHideDuration: 6000, ...notification },
      ],
    }));
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    })),
}));
