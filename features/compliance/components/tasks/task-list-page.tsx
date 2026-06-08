"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./task-card";
import { TaskCreateModal } from "./task-create-modal";
import { TaskDetailModal } from "./task-detail-modal";
import { SuggestedTasksWidget } from "./suggested-tasks-widget";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "../../hooks/use-tasks-query";
import { reconcileTaskStatuses } from "../../api/tasks-api";
import { getActiveBusinessId } from "@/lib/stores/app-store";
import { SetupOverlay } from "@/features/billing/components/setup-overlay";
import { isInSetupMode } from "@/features/billing/api/setup-check";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import { useHasBusiness } from "@/features/businesses/hooks/use-has-business";
import { EmptyBusinessState } from "@/features/businesses/components/empty-business-state";
import type { ComplianceTaskItem, CreateTaskInput, UpdateTaskInput } from "../../types/tasks.types";
import styles from "./task-list-page.module.css";

type FilterKey = "all" | "pending" | "in_progress" | "completed" | "overdue";
type SourceFilter = "all" | "manual" | "suggested";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "overdue", label: "Overdue" },
];

export function TaskListPage() {
  const { data: tasks = [], isLoading } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ComplianceTaskItem | null>(null);
  const hasBusiness = useHasBusiness();

  useEffect(() => {
    reconcileTaskStatuses();
    trackEvent("Compliance Tasks Viewed");
  }, []);

  const filtered = useMemo(() => {
    let result = [...tasks];
    if (filter === "overdue") result = result.filter((t) => t.status === "overdue");
    else if (filter === "pending") result = result.filter((t) => t.status === "pending");
    else if (filter === "in_progress") result = result.filter((t) => t.status === "in_progress");
    else if (filter === "completed") result = result.filter((t) => t.status === "completed");
    if (sourceFilter === "manual") result = result.filter((t) => t.source === "manual");
    else if (sourceFilter === "suggested") result = result.filter((t) => t.source === "suggested");
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return result;
  }, [tasks, filter, sourceFilter, search]);

  async function handleCreate(input: CreateTaskInput) {
    await createTaskMutation.mutateAsync({ input, businessId: getActiveBusinessId() || "" });
    trackEvent("Task Created", { title: input.title });
    setShowCreate(false);
  }

  async function handleUpdate(id: string, input: UpdateTaskInput) {
    await updateTaskMutation.mutateAsync({ id, input });
    trackEvent("Task Updated", { id });
    if (input.status === "completed") trackEvent("Task Completed", { id });
    setSelectedTask(null);
  }

  async function handleDelete(id: string) {
    await deleteTaskMutation.mutateAsync(id);
    trackEvent("Task Deleted", { id });
    setSelectedTask(null);
  }

  return (
    <SetupOverlay>
    <div className={styles.page}>
      {!isInSetupMode() && hasBusiness === false ? (
        <EmptyBusinessState />
      ) : (
        <>
          <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Compliance Tasks</h1>
          <p className={styles.subtitle}>Track and manage your compliance obligations.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowCreate(true)}>
          <Plus size={16} />
          New Task
        </Button>
      </div>

      <SuggestedTasksWidget />

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input className={styles.search} placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button key={f.key} className={`${styles.filterBtn} ${filter === f.key ? styles.filterActive : ""}`} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>
        <select className={styles.sourceSelect} value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}>
          <option value="all">All Sources</option>
          <option value="manual">Manual Tasks</option>
          <option value="suggested">Suggested Tasks</option>
        </select>
      </div>

      {isLoading ? (
        <div className={styles.empty}><p className={styles.emptyText}>Loading tasks...</p></div>
      ) : filtered.length > 0 ? (
        <div className={styles.list}>
          {filtered.map((t) => <TaskCard key={t.id} task={t} onClick={setSelectedTask} />)}
        </div>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            {tasks.length === 0 ? "You do not have any compliance tasks yet." : "No tasks match the selected filters."}
          </p>
          {tasks.length === 0 && <Button variant="primary" size="md" onClick={() => setShowCreate(true)}>Create Your First Task</Button>}
        </div>
      )}

      {showCreate && <TaskCreateModal onSave={handleCreate} onClose={() => setShowCreate(false)} />}
      {selectedTask && <TaskDetailModal task={selectedTask} onUpdate={handleUpdate} onDelete={handleDelete} onClose={() => setSelectedTask(null)} />}
        </>
      )}
    </div>
    </SetupOverlay>
  );
}
