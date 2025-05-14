import { useToastStore } from "@/state/toastStore";
import { useEffect, useState } from "react";

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();
  // 트리거용 state (progress bar animation)
  const [, setTick] = useState(0);

  useEffect(() => {
    // 30ms마다 리렌더링
    const interval = setInterval(() => setTick((t) => t + 1), 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
      {toasts.map((toast) => {
        const now = Date.now();
        const duration = toast.duration ?? 1000;
        const elapsed = now - toast.createdAt;
        const progress = Math.max(0, Math.min(1, 1 - elapsed / duration));
        return (
          <div
            key={toast.id}
            className={`pt-2 rounded shadow-lg text-sm text-white cursor-pointer transition-all mb-1
              ${toast.type === "error" ? "bg-red-600" : "bg-blue-600"}`}
            onClick={() => removeToast(toast.id)}
            style={{ minWidth: 200 }}
            data-testid={`toast-${toast.id}`}
          >
            <span className="px-4" data-testid={`toast-message-${toast.id}`}>
              {toast.message}
            </span>
            <div className="w-full h-0.5 mt-1 relative rounded">
              <div
                className={`absolute left-0 top-0 h-full rounded ${
                  toast.type === "error" ? "bg-red-100" : "bg-blue-100"
                }`}
                style={{ width: `${progress * 100}%` }}
                data-testid={`progress-bar-${toast.id}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
