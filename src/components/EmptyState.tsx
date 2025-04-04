
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon = <CalendarPlus className="h-12 w-12 text-muted-foreground/50" />,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 my-8">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          <Plus className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
