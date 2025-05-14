import { create } from "zustand";

export interface Toast {
  id: number;
  message: string;
  type?: "info" | "error";
  duration?: number;
  createdAt: number;
}

interface ToastStore {
  toasts: Toast[];
  showToast: (
    message: string,
    options?: Omit<Toast, "id" | "message" | "createdAt">
  ) => void;
  removeToast: (id: number) => void;
}

let toastId = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (message, options) => {
    const id = ++toastId;
    const createdAt = Date.now();
    const toast: Toast = { id, message, createdAt, ...options };
    set((state) => ({ toasts: [...state.toasts, toast] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, options?.duration ?? 1000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
