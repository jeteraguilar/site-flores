"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { CatalogData } from "@/lib/types";

export const ADMIN_KEY = ["admin", "catalog"] as const;

export function useAdminCatalog() {
  return useQuery({ queryKey: ADMIN_KEY, queryFn: () => api<CatalogData>("/api/admin/catalog") });
}

/** POST mutation that refreshes the admin data and the public pages afterwards. */
export function useAdminMutation<TInput>(path: string, successMessage: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TInput) => api<unknown>(path, input),
    onSuccess: async () => {
      toast.success(successMessage);
      await qc.invalidateQueries({ queryKey: ADMIN_KEY });
    },
    onError: (err: Error & { status?: number }) => {
      if (err.status === 401) window.location.assign("/login");
      toast.error(err.message);
    },
  });
}

export async function confirmAndRun(question: string, run: () => Promise<unknown>) {
  if (!window.confirm(question)) return;
  await run().catch(() => undefined); // errors already surfaced by the mutation's onError
}
