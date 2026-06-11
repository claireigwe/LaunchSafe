export type AuditAction =
  | "task.created"
  | "task.updated"
  | "task.completed"
  | "task.deleted"
  | "document.uploaded"
  | "document.generated"
  | "document.deleted"
  | "subscription.activated"
  | "subscription.cancelled"
  | "subscription.changed"
  | "payment.processed"
  | "business.created"
  | "business.updated"
  | "business.deleted"
  | "profile.updated"
  | "password.changed"
  | "team.invited"
  | "team.removed"
  | "report.exported"
  | "login";

export type AuditEntityType =
  | "task" | "document" | "subscription" | "payment" | "business"
  | "profile" | "team" | "report" | "session";

async function sendAudit(
  action: AuditAction,
  entityType: AuditEntityType,
  entityId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await fetch("/api/audit-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, entityType, entityId, metadata }),
    });
  } catch {}
}

export const audit = {
  taskCreated: (id: string, title: string) =>
    sendAudit("task.created", "task", id, { title }),
  taskCompleted: (id: string, title: string) =>
    sendAudit("task.completed", "task", id, { title }),
  taskDeleted: (id: string, title: string) =>
    sendAudit("task.deleted", "task", id, { title }),
  taskUpdated: (id: string, changes: string) =>
    sendAudit("task.updated", "task", id, { changes }),
  documentUploaded: (id: string, title: string) =>
    sendAudit("document.uploaded", "document", id, { title }),
  documentGenerated: (id: string, title: string) =>
    sendAudit("document.generated", "document", id, { title }),
  documentDeleted: (id: string, title: string) =>
    sendAudit("document.deleted", "document", id, { title }),
  subscriptionActivated: (plan: string) =>
    sendAudit("subscription.activated", "subscription", undefined, { plan }),
  subscriptionCancelled: () =>
    sendAudit("subscription.cancelled", "subscription"),
  subscriptionChanged: (from: string, to: string) =>
    sendAudit("subscription.changed", "subscription", undefined, { from, to }),
  paymentProcessed: (ref: string, amount: number) =>
    sendAudit("payment.processed", "payment", ref, { amount }),
  businessCreated: (id: string, name: string) =>
    sendAudit("business.created", "business", id, { name }),
  businessUpdated: (id: string, name: string) =>
    sendAudit("business.updated", "business", id, { name }),
  businessDeleted: (id: string, name: string) =>
    sendAudit("business.deleted", "business", id, { name }),
  profileUpdated: (field: string) =>
    sendAudit("profile.updated", "profile", undefined, { field }),
  passwordChanged: () =>
    sendAudit("password.changed", "session"),
  login: (method: string) =>
    sendAudit("login", "session", undefined, { method }),
  teamInvited: (email: string) =>
    sendAudit("team.invited", "team", undefined, { email }),
  teamRemoved: (memberId: string) =>
    sendAudit("team.removed", "team", memberId),
  reportExported: (reportType: string) =>
    sendAudit("report.exported", "report", undefined, { reportType }),
};
