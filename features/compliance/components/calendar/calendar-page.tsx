"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "../tasks/task-card";
import { TaskCreateModal } from "../tasks/task-create-modal";
import { TaskDetailModal } from "../tasks/task-detail-modal";
import { loadTasks, createTask, updateTask, deleteTask, reconcileTaskStatuses } from "../../api/tasks-api";
import { SetupOverlay } from "@/features/billing/components/setup-overlay";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import type { ComplianceTaskItem, CreateTaskInput, UpdateTaskInput } from "../../types/tasks.types";
import styles from "./calendar-page.module.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarPage() {
  const [tasks, setTasks] = useState<ComplianceTaskItem[]>([]);
  const [today] = useState(() => new Date());
  const [view, setView] = useState<"monthly" | "weekly">("monthly");
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ComplianceTaskItem | null>(null);

  useEffect(() => {
    reconcileTaskStatuses();
    setTasks(loadTasks());
    trackEvent("Calendar Viewed");
  }, []);

  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const startDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
  const monthLabel = cursor.toLocaleDateString("en-NG", { month: "long", year: "numeric" });

  function prev() { setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)); }
  function next() { setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)); }

  const dateTasks = useMemo(() => {
    const map = new Map<string, ComplianceTaskItem[]>();
    for (const t of tasks) {
      if (t.dueDate) {
        const d = t.dueDate.split("T")[0];
        if (!map.has(d)) map.set(d, []);
        map.get(d)!.push(t);
      }
    }
    return map;
  }, [tasks]);

  async function handleCreate(input: CreateTaskInput) {
    await createTask(input, "onboarded");
    trackEvent("Task Created", { title: input.title });
    setTasks(loadTasks());
    setShowCreate(false);
  }

  async function handleUpdate(id: string, input: UpdateTaskInput) {
    await updateTask(id, input);
    if (input.status === "completed") trackEvent("Task Completed", { id });
    setTasks(loadTasks());
    setSelectedTask(null);
  }

  async function handleDelete(id: string) {
    await deleteTask(id);
    trackEvent("Task Deleted", { id });
    setTasks(loadTasks());
    setSelectedTask(null);
  }

  function isToday(day: number) {
    return today.getDate() === day && today.getMonth() === cursor.getMonth() && today.getFullYear() === cursor.getFullYear();
  }

  function formatDate(day: number) {
    const d = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    return d.toISOString().split("T")[0];
  }

  const todayStr = today.toISOString().split("T")[0];
  const weekDays = view === "weekly"
    ? Array.from({ length: 7 }, (_, i) => {
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay() + i);
        return start;
      })
    : [];

  return (
    <SetupOverlay>
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Calendar</h1>
          <p className={styles.subtitle}>View your compliance deadlines.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowCreate(true)}><Plus size={16} />New Task</Button>
      </div>

      <div className={styles.controls}>
        <button className={styles.viewBtn} onClick={() => setView("monthly")}>Monthly</button>
        <button className={styles.viewBtn} onClick={() => setView("weekly")}>Weekly</button>
      </div>

      {view === "monthly" ? (
        <div className={styles.calendar}>
          <div className={styles.nav}>
            <button className={styles.navBtn} onClick={prev}><ChevronLeft size={18} /></button>
            <span className={styles.monthLabel}>{monthLabel}</span>
            <button className={styles.navBtn} onClick={next}><ChevronRight size={18} /></button>
          </div>
          <div className={styles.dayHeaders}>{DAYS.map((d) => <div key={d} className={styles.dayHeader}>{d}</div>)}</div>
          <div className={styles.grid}>
            {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} className={styles.dayCell} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = formatDate(day);
              const dayTasks = dateTasks.get(dateStr) || [];
              return (
                <div key={day} className={`${styles.dayCell} ${isToday(day) ? styles.today : ""}`}>
                  <span className={styles.dayNum}>{day}</span>
                  <div className={styles.dayTasks}>
                    {dayTasks.slice(0, 2).map((t) => (
                      <button key={t.id} className={`${styles.dayTask} ${t.status === "overdue" ? styles.dayTaskOverdue : ""}`} onClick={() => setSelectedTask(t)} title={t.title}>
                        {t.title}
                      </button>
                    ))}
                    {dayTasks.length > 2 && <span className={styles.moreTasks}>+{dayTasks.length - 2} more</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={styles.weekly}>
          {weekDays.map((d) => {
            const dateStr = d.toISOString().split("T")[0];
            const dayTasks = dateTasks.get(dateStr) || [];
            const isT = d.toDateString() === today.toDateString();
            return (
              <div key={dateStr} className={`${styles.weekDay} ${isT ? styles.weekToday : ""}`}>
                <div className={styles.weekDayHeader}>
                  <span className={styles.weekDayName}>{d.toLocaleDateString("en-NG", { weekday: "short" })}</span>
                  <span className={styles.weekDayNum}>{d.getDate()}</span>
                </div>
                <div className={styles.weekTasks}>
                  {dayTasks.length > 0 ? dayTasks.map((t) => (
                    <button key={t.id} className={`${styles.weekTask} ${t.status === "overdue" ? styles.weekTaskOverdue : ""}`} onClick={() => setSelectedTask(t)}>
                      {t.title}
                    </button>
                  )) : <span className={styles.noTasks}>No tasks</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tasks.filter((t) => t.status !== "completed" && t.dueDate).length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No upcoming compliance deadlines.</p>
          <Button variant="primary" size="md" onClick={() => setShowCreate(true)}>Add Task</Button>
        </div>
      )}

      {showCreate && <TaskCreateModal onSave={handleCreate} onClose={() => setShowCreate(false)} />}
      {selectedTask && <TaskDetailModal task={selectedTask} onUpdate={handleUpdate} onDelete={handleDelete} onClose={() => setSelectedTask(null)} />}
    </div>
    </SetupOverlay>
  );
}
