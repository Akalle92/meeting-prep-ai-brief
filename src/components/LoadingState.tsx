
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center h-40 md:h-64 animate-fade-in ${className || ""}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <Loader2 className="h-8 w-8 md:h-12 md:w-12 text-primary animate-spin mb-4 relative z-10" />
      </div>
      <p className="text-muted-foreground text-base md:text-lg mt-4">{message}</p>
    </div>
  );
}
