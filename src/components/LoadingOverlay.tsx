import { Loader2 } from "lucide-react";

export default function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-accent/20" />
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
        <Loader2 className="h-6 w-6 animate-pulse text-accent" />
      </div>
      <div className="text-center">
        <p className="font-mono text-sm font-medium text-accent">
          {message ?? "Running AI simulation..."}
        </p>
        <p className="mt-1 text-xs text-slate-500">Analyzing incident parameters and optimizing resource dispatch</p>
      </div>
      <div className="mt-2 w-64 max-w-full overflow-hidden rounded-full bg-ink-800">
        <div className="h-1 w-1/3 animate-scan rounded-full bg-gradient-to-r from-transparent via-accent to-transparent" />
      </div>
    </div>
  );
}
