"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Pencil, Plus, ArrowUp, Trash2, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBusinessData, getBusinessDataById, fetchAllBusinesses, loadCachedBusinesses, saveBusinessData, saveBusinessDataForBusiness, removeBusiness, type StoredBusiness } from "@/features/businesses/api/onboarding-api";
import { useAppStore } from "@/lib/stores/app-store";
import { audit } from "@/features/audit/api/audit-api";
import { canAccess, getPlanLimit, getCurrentPlanName, getCurrentPlanId } from "@/features/billing/api/feature-access";
import { getIndustriesSync } from "@/features/assessments/api/industries-api";
import { EditBusinessModal } from "./edit-business-modal";
import styles from "./business-page.module.css";

export function BusinessPage() {
  const router = useRouter();
  const cached = useMemo(() => loadCachedBusinesses(), []);
  const [businesses, setBusinesses] = useState<StoredBusiness[]>(cached);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StoredBusiness | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const firstId = cached.length > 0 ? cached[0].id : null;
    return firstId;
  });

  const activeBusinessId = useAppStore((s) => s.activeBusinessId);
  const setActiveBusinessId = useAppStore((s) => s.setActiveBusinessId);

  const [saved, setSaved] = useState<any>(() => {
    if (cached.length === 0) return null;
    const firstId = cached[0].id;
    localStorage.setItem("launchsafe-active-business", firstId);
    return getBusinessDataById(firstId) as any;
  });

  async function loadBusinessFromServer(id: string): Promise<any> {
    try {
      const res = await fetch(`/api/businesses/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        const det: any = d.details || {};
        
        if (d.description) {
          try {
            const parsed = JSON.parse(d.description);
            if (parsed.fullData) {
              return parsed.fullData;
            }
          } catch {}
        }

        return {
          info: {
            businessName: d.name || "",
            businessType: det.businessType || "",
            industry: d.industryId || "",
            state: d.stateId || "",
            website: d.website || "",
            description: "",
          },
          status: {
            isRegistered: det.isRegistered ?? null,
            hasCAC: det.hasCAC ?? null,
            cacNumber: det.cacNumber || null,
          },
          operations: {
            employeeCount: d.employeeCount ? String(d.employeeCount) : "",
            hasPhysicalLocation: det.hasPhysicalLocation ?? null,
            hasOnlineOperations: det.hasOnlineOperations ?? null,
          },
        };
      }
    } catch {}
    return null;
  }

  useEffect(() => {
    async function loadData() {
      const all = await fetchAllBusinesses();
      setBusinesses(all);
      
      let initialId = activeBusinessId;
      if (!initialId || !all.find((b) => b.id === initialId)) {
        initialId = all.length > 0 ? all[0].id : null;
        if (initialId) setActiveBusinessId(initialId);
      }
      
      setSelectedId(initialId);
      if (initialId && initialId !== "biz-migrated") {
        const server = await loadBusinessFromServer(initialId);
        setSaved(server || getBusinessDataById(initialId) as any);
      } else if (initialId) {
        setSaved(getBusinessData() as any);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    if (selectedId === "biz-migrated") {
      setSaved(getBusinessData() as any);
    } else {
      loadBusinessFromServer(selectedId).then((server) => {
        setSaved(server || getBusinessDataById(selectedId) as any);
      });
    }
  }, [selectedId]);

  useEffect(() => { setDeleteConfirmName(""); }, [deleteTarget]);

  const info = saved?.info || null;
  const status = saved?.status || null;
  const operations = saved?.operations || null;
  const planName = getCurrentPlanName();
  const planLimit = getPlanLimit("businesses");
  const searchParams = useSearchParams();
  const [showLimitBanner, setShowLimitBanner] = useState(searchParams.get("limit_reached") === "true");
  const canAddBiz = canAccess("multi_business");
  const count = businesses.length;
  const atLimit = canAddBiz && count >= planLimit;

  function handleSelectBusiness(id: string) {
    setSelectedId(id);
    setActiveBusinessId(id);
  }

  const selected = businesses.find((b) => b.id === selectedId);

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
    if (selectedId === "biz-migrated") {
      saveBusinessData(updated);
    } else if (selectedId) {
      saveBusinessDataForBusiness(selectedId, updated);
    }

    if (selectedId && selectedId !== "biz-migrated") {
      fetch(`/api/businesses/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.businessName,
          website: formData.website || null,
          employeeCount: formData.employeeCount || null,
          description: formData.description || null,
          industrySlug: formData.industry || null,
          stateSlug: formData.state || null,
          details: {
            businessType: formData.businessType,
            isRegistered: formData.isRegistered,
            hasCAC: formData.hasCAC,
            cacNumber: formData.cacNumber,
            hasPhysicalLocation: formData.hasPhysicalLocation,
            hasOnlineOperations: formData.hasOnlineOperations,
          },
        }),
      }).catch(() => {});
    }

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
            <Button variant="primary" size="md" onClick={() => router.push("/business-onboarding?mode=add-business")}>Add Your Business</Button>
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

      {showLimitBanner && (
        <div className={styles.limitBanner}>
          <span>Your {getCurrentPlanName()} plan allows up to {getPlanLimit("businesses")} businesses. Please upgrade to add more.</span>
          <button type="button" className={styles.limitBannerClose} onClick={() => setShowLimitBanner(false)}>×</button>
        </div>
      )}

      <div className={styles.layout}>
        <aside className={styles.sidebarList}>
          <h2 className={styles.listTitle}>All Businesses</h2>
          <div className={styles.list}>
            {businesses.map((b) => (
              <div
                key={b.id}
                role="button"
                tabIndex={0}
                className={`${styles.listItem} ${selectedId === b.id ? styles.listItemActive : ""}`}
                onClick={() => handleSelectBusiness(b.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleSelectBusiness(b.id); }}
              >
                <Building2 size={16} className={styles.listIcon} />
                <div className={styles.listInfo}>
                  <span className={styles.listName}>
                    {b.name}
                    {activeBusinessId === b.id && <CheckCircle2 size={12} className={styles.activeBadge} />}
                  </span>
                  <span className={styles.listMeta}>
                    {getIndustriesSync().find((i) => i.slug === b.industry)?.name || b.industry || "—"} · {stateLabels[b.state] || b.state || "—"}
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
              </div>
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
                {saved && (
                  <button type="button" className={styles.editBtn} onClick={() => setShowEdit(true)}>
                    <Pencil size={14} /> Edit
                  </button>
                )}
              </div>
              <div className={styles.detailBody}>
                <DetailRow label="Industry" value={getIndustriesSync().find((i) => i.slug === info?.industry)?.name || info?.industry || selected?.industry || "—"} />
                {info?.businessType && <DetailRow label="Type" value={info.businessType} />}
                <DetailRow label="State" value={stateLabels[info?.state] || info?.state || stateLabels[selected?.state] || selected?.state || "—"} />
                {info?.website && <DetailRow label="Website" value={info.website} />}
                {info?.description && <DetailRow label="Description" value={info.description} />}
                <DetailRow label="Registered" value={status?.isRegistered ? "Yes" : status?.isRegistered === false ? "No" : "—"} />
                {status?.cacNumber && <DetailRow label="CAC Number" value={status.cacNumber} />}
                <DetailRow label="Employees" value={operations?.employeeCount || "—"} />
                <DetailRow label="Physical Location" value={operations?.hasPhysicalLocation ? "Yes" : operations?.hasPhysicalLocation === false ? "No" : "—"} />
                <DetailRow label="Online Operations" value={operations?.hasOnlineOperations ? "Yes" : operations?.hasOnlineOperations === false ? "No" : "—"} />
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
            <p className={styles.confirmText}>
              This action <strong>cannot be undone</strong>. All associated compliance data, documents, and records will be permanently removed.
            </p>
            <p className={styles.confirmText}>
              Type <strong>{deleteTarget.name}</strong> below to confirm deletion:
            </p>
            <input
              className={styles.confirmInput}
              type="text"
              placeholder={deleteTarget.name}
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              autoFocus
            />
            <div className={styles.confirmActions}>
              <button type="button" className={styles.confirmCancel} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button
                type="button"
                className={styles.confirmDelete}
                disabled={deleteConfirmName !== deleteTarget.name}
                onClick={async () => {
                  if (deleteConfirmName !== deleteTarget.name) return;
                  await removeBusiness(deleteTarget.id);
                  audit.businessDeleted(deleteTarget.id, deleteTarget.name);
                  window.location.reload();
                }}
              >Delete Business</button>
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
