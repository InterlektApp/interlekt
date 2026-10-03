import { create } from "zustand";

export type PaymentPhase =
  | "idle"
  | "initializing"
  | "redirecting"
  | "polling"
  | "success"
  | "failed"
  | "timeout";

interface PaymentFlowState {
  phase: PaymentPhase;
  reference: string | null;
  authorizationUrl: string | null;
  error: string | null;
  pollCount: number;
  start: (reference: string, authorizationUrl: string) => void;
  setPhase: (phase: PaymentPhase, error?: string) => void;
  incrementPoll: () => void;
  reset: () => void;
}

const initial = {
  phase: "idle" as PaymentPhase,
  reference: null as string | null,
  authorizationUrl: null as string | null,
  error: null as string | null,
  pollCount: 0,
};

/**
 * The single Zustand store in the app. Everything else is URL state
 * or TanStack Query. A second store is scope creep.
 */
export const usePaymentFlowStore = create<PaymentFlowState>((set) => ({
  ...initial,
  start: (reference, authorizationUrl) =>
    set({ phase: "redirecting", reference, authorizationUrl, error: null, pollCount: 0 }),
  setPhase: (phase, error) => set({ phase, error: error ?? null }),
  incrementPoll: () => set((s) => ({ pollCount: s.pollCount + 1 })),
  reset: () => set(initial),
}));
