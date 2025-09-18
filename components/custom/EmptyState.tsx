import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {description && (
        <p className="mt-2 text-muted-foreground max-w-md">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Button asChild className="mt-4 text-white">
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      )}
    </div>
  );
}
