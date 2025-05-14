import { create } from "zustand";

export interface Toast {
  id: number;
  message: string;
  type?: "info" | "error";
  duration?: number;
  createdAt: number;
}

interface ToastStore {
  toastId: number;
  toasts: Toast[];
  showToast: (
    message: string,
    options?: Omit<Toast, "id" | "message" | "createdAt">
  ) => void;
  removeToast: (id: number) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toastId: 0,
  toasts: [],
  showToast: (message, options) => {
    const id = ++get().toastId;
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
