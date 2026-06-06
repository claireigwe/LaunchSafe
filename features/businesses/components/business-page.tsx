"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Pencil, Plus, ArrowUp, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBusinessData, getAllBusinesses, saveBusinessData, removeBusiness, type StoredBusiness } from "@/features/businesses/api/onboarding-api";
import { audit } from "@/features/audit/api/audit-api";
import { getSubscription } from "@/features/billing/api/billing-api";
import { canAccess, getPlanLimit, getCurrentPlanName } from "@/features/billing/api/feature-access";
import { getIndustriesSync } from "@/features/assessments/api/industries-api";
import { EditBusinessModal } from "./edit-business-modal";
import styles from "./business-page.module.css";

export function BusinessPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<StoredBusiness[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StoredBusiness | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const saved = getBusinessData() as any;
  const info = saved?.info;
  const status = saved?.status;
  const operations = saved?.operations;
  const sub = getSubscription();
  const planName = getCurrentPlanName();
  const planLimit = getPlanLimit("businesses");
  const canAddBiz = canAccess("multi_business");
  const count = businesses.length;
  const atLimit = canAddBiz && count >= planLimit;

  useEffect(() => {
    const all = getAllBusinesses();
    setBusinesses(all);
    if (all.length > 0) setSelectedId(all[0].id);
  }, []);

  const selected = businesses.find((b) => b.id === selectedId);
  const isPrimary = selectedId === "biz-migrated" || (selected && businesses.indexOf(selected) === 0);

  const editInitial = {
    businessName: info?.businessName || "",
    businessType: info?.businessType || "",
    industry: info?.industry || "",
    state: info?.state || "",
    website: info?.website || "",
    description: info?.description || "",
    employeeCount: operations?.employeeCount || "",
    isRegistered: status?.isRegistered ?? null,
    hasCAC: status?.hasCAC ?? null,
    cacNumber: status?.cacNumber || "",
    hasPhysicalLocation: operations?.hasPhysicalLocation ?? null,
    hasOnlineOperations: operations?.hasOnlineOperations ?? null,
  };

  function handleEditSave(formData: typeof editInitial) {
    const updated = {
      ...saved,
      info: { ...(saved?.info || {}), businessName: formData.businessName, businessType: formData.businessType, industry: formData.industry, state: formData.state, website: formData.website, description: formData.description },
      status: { ...(saved?.status || {}), isRegistered: formData.isRegistered, hasCAC: formData.hasCAC, cacNumber: formData.cacNumber },
      operations: { ...(saved?.operations || {}), employeeCount: formData.employeeCount, hasPhysicalLocation: formData.hasPhysicalLocation, hasOnlineOperations: formData.hasOnlineOperations },
      _updatedAt: new Date().toISOString(),
    };
    saveBusinessData(updated);
    setShowEdit(false);
    window.location.reload();
  }

  const stateLabels: Record<string, string> = { lagos: "Lagos", oyo: "Oyo", "abuja-fct": "Abuja (FCT)", rivers: "Rivers", kano: "Kano" };

  if (businesses.length === 0 && !info?.businessName) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Business</h1>
          <p className={styles.subtitle}>You have not added a business yet.</p>
        </div>
        <div className={styles.emptyCard}>
          <Building2 size={48} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>No Business Profile</h2>
          <p className={styles.emptyText}>Add your business to start managing compliance.</p>
          <div className={styles.emptyActions}>
            <Button variant="primary" size="md" onClick={() => router.push("/business-onboarding")}>Add Your Business</Button>
            <Button variant="outline" size="md" onClick={() => router.push("/business-onboarding?mode=change-plan")}>Subscribe to a Plan</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Business{count > 1 ? ` (${count})` : ""}</h1>
        <p className={styles.subtitle}>
          {canAddBiz
            ? `${count} of ${planLimit} businesses on your ${planName} plan.`
            : `${count} business on your ${planName} plan. Upgrade to add more.`}
        </p>
        <div className={styles.headerActions}>
          {canAddBiz && !atLimit && (
            <Button variant="outline" size="sm" onClick={() => router.push("/business-onboarding?mode=add-business")}>
              <Plus size={14} /> Add Business
            </Button>
          )}
          {!canAddBiz && (
            <Button variant="outline" size="sm" onClick={() => router.push("/business-onboarding?mode=change-plan")}>
              <ArrowUp size={14} /> Upgrade
            </Button>
          )}
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebarList}>
          <h2 className={styles.listTitle}>All Businesses</h2>
          <div className={styles.list}>
            {businesses.map((b) => (
              <button
                key={b.id}
                type="button"
                className={`${styles.listItem} ${selectedId === b.id ? styles.listItemActive : ""}`}
                onClick={() => setSelectedId(b.id)}
              >
                <Building2 size={16} className={styles.listIcon} />
                <div className={styles.listInfo}>
                  <span className={styles.listName}>{b.name}</span>
                  <span className={styles.listMeta}>
                    {getIndustriesSync().find((i) => i.id === b.industry)?.name || b.industry || "—"} · {stateLabels[b.state] || b.state || "—"}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.listDelete}
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(b); }}
                  aria-label={`Delete ${b.name}`}
                >
                  <Trash2 size={13} />
                </button>
              </button>
            ))}
          </div>

          <div className={styles.planSummary}>
            <span className={styles.planLabel}>{planName} Plan</span>
            <span className={styles.planCount}>{count} of {planLimit} used</span>
            <Button variant="ghost" size="sm" fullWidth onClick={() => router.push("/settings/billing")}>Manage Billing</Button>
          </div>
        </aside>

        <main className={styles.detail}>
          {selected ? (
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <h2 className={styles.detailTitle}>{selected.name}</h2>
                {isPrimary && (
                  <button type="button" className={styles.editBtn} onClick={() => setShowEdit(true)}>
                    <Pencil size={14} /> Edit
                  </button>
                )}
              </div>
              <div className={styles.detailBody}>
                {isPrimary ? (
                  <>
                    <DetailRow label="Industry" value={getIndustriesSync().find((i) => i.id === info?.industry)?.name || info?.industry || "—"} />
                    <DetailRow label="Type" value={info?.businessType || "—"} />
                    <DetailRow label="State" value={stateLabels[info?.state] || info?.state || "—"} />
                    {info?.website && <DetailRow label="Website" value={info.website} />}
                    {info?.description && <DetailRow label="Description" value={info.description} />}
                    <DetailRow label="Registered" value={status?.isRegistered ? "Yes" : status?.isRegistered === false ? "No" : "—"} />
                    {status?.cacNumber && <DetailRow label="CAC Number" value={status.cacNumber} />}
                    <DetailRow label="Employees" value={operations?.employeeCount || "—"} />
                    <DetailRow label="Physical Location" value={operations?.hasPhysicalLocation ? "Yes" : operations?.hasPhysicalLocation === false ? "No" : "—"} />
                    <DetailRow label="Online Operations" value={operations?.hasOnlineOperations ? "Yes" : operations?.hasOnlineOperations === false ? "No" : "—"} />
                  </>
                ) : (
                  <>
                    <DetailRow label="Industry" value={getIndustriesSync().find((i) => i.id === selected.industry)?.name || selected.industry || "—"} />
                    <DetailRow label="State" value={stateLabels[selected.state] || selected.state || "—"} />
                    <p className={styles.placeholder}>Select this business to manage its compliance data.</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetail}>
              <Building2 size={32} className={styles.emptyDetailIcon} />
              <p>Select a business to view details.</p>
            </div>
          )}
        </main>
      </div>

      {showEdit && <EditBusinessModal initial={editInitial} onSave={handleEditSave} onClose={() => setShowEdit(false)} />}

      {deleteTarget && (
        <div className={styles.overlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.confirmTitle}>Delete Business?</h3>
            <p className={styles.confirmText}>This will permanently remove <strong>{deleteTarget.name}</strong> and its associated compliance data. This action cannot be undone.</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.confirmCancel} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button type="button" className={styles.confirmDelete} onClick={async () => { await removeBusiness(deleteTarget.id); audit.businessDeleted(deleteTarget.id, deleteTarget.name); window.location.reload(); }}>Delete Business</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}
