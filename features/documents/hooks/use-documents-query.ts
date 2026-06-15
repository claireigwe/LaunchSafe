"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDocuments, uploadDocument, deleteDocument } from "../api/documents-api";
import { getGeneratedDocuments, generateDocument } from "../api/document-generation";
import { useAppStore } from "@/lib/stores/app-store";
import type { UploadDocumentInput } from "../api/documents-api";
import type { DocumentType } from "@/types/domain/document";

export function useDocuments() {
  const activeBusinessId = useAppStore((s) => s.activeBusinessId);
  return useQuery({
    queryKey: ["documents", activeBusinessId],
    queryFn: () => getDocuments(),
    staleTime: 60_000,
    gcTime: 120_000,
  });
}

export function useGeneratedDocuments() {
  const activeBusinessId = useAppStore((s) => s.activeBusinessId);
  return useQuery({
    queryKey: ["documents", "generated", activeBusinessId],
    queryFn: () => getGeneratedDocuments(),
    staleTime: 60_000,
    gcTime: 120_000,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const activeBusinessId = useAppStore((s) => s.activeBusinessId);
  return useMutation({
    mutationFn: (input: UploadDocumentInput) => uploadDocument(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", activeBusinessId] });
    },
  });
}

export function useGenerateDocument() {
  const queryClient = useQueryClient();
  const activeBusinessId = useAppStore((s) => s.activeBusinessId);
  return useMutation({
    mutationFn: (input: { docType: DocumentType; context: string; businessId?: string }) => 
      generateDocument(input.docType, input.context, input.businessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", "generated", activeBusinessId] });
      queryClient.invalidateQueries({ queryKey: ["documents", activeBusinessId] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const activeBusinessId = useAppStore((s) => s.activeBusinessId);
  return useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", activeBusinessId] });
    },
  });
}
