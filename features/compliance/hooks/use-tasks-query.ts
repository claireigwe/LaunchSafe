"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { refreshTasks, createTask, updateTask, deleteTask, completeTask } from "../api/tasks-api";
import { useAppStore } from "@/lib/stores/app-store";
import type { CreateTaskInput, UpdateTaskInput, ComplianceTaskItem } from "../types/tasks.types";

export function useTasks() {
  const activeBusinessId = useAppStore((s) => s.activeBusinessId);
  return useQuery({
    queryKey: ["tasks", activeBusinessId],
    queryFn: () => refreshTasks(activeBusinessId || undefined),
    staleTime: 30_000,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const activeBusinessId = useAppStore((s) => s.activeBusinessId);
  return useMutation({
    mutationFn: ({ input, businessId }: { input: CreateTaskInput; businessId: string }) =>
      createTask(input, businessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeBusinessId] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const activeBusinessId = useAppStore((s) => s.activeBusinessId);
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      updateTask(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeBusinessId] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const activeBusinessId = useAppStore((s) => s.activeBusinessId);
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeBusinessId] });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  const activeBusinessId = useAppStore((s) => s.activeBusinessId);
  return useMutation({
    mutationFn: (id: string) => completeTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeBusinessId] });
    },
  });
}
