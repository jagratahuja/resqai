import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-signal-red/10 ring-1 ring-signal-red/30">
        <AlertTriangle className="h-7 w-7 text-signal-red" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-200">Simulation Failed</p>
        <p className="mt-1 max-w-sm text-xs text-slate-500">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost">
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      )}
    </div>
  );
}
