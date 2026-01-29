import { Sparkles } from "lucide-react";

interface DealBadgeProps {
  variant?: "default" | "large";
  text?: string;
}

export function DealBadge({ variant = "default", text = "HOT OFFER" }: DealBadgeProps) {
  if (variant === "large") {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-full font-heading font-semibold text-sm shadow-lg">
        <Sparkles className="h-4 w-4" />
        <span>{text}</span>
        <Sparkles className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md font-heading font-semibold text-xs shadow-md">
      <Sparkles className="h-3 w-3" />
      <span>{text}</span>
    </div>
  );
}
