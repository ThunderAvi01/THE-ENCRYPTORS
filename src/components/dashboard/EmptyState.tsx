import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon = <FolderOpen className="h-8 w-8 text-muted-foreground" />,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`p-8 rounded-xl border border-dashed border-border bg-muted/20 text-center space-y-3 ${className}`}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted/60">
        {icon}
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-1">
          <Button variant="clinical" size="sm" onClick={onAction} className="text-xs">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
