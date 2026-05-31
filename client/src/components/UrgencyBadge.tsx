import type { UrgencyLevel } from "../types";

interface UrgencyBadgeProps {
  level: UrgencyLevel;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

const LABELS: Record<UrgencyLevel, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export default function UrgencyBadge({
  level,
  size = "md",
  pulse = false,
}: UrgencyBadgeProps) {
  return (
    <span
      className={`urgency-badge urgency-${level} urgency-${size} ${pulse ? "urgency-pulse" : ""}`}
    >
      {(level === "critical" || level === "high") && (
        <span className="urgency-dot" />
      )}
      {LABELS[level]}
    </span>
  );
}
