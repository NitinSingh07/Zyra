import { useState } from "react";
import type { Task } from "../types";
import { updateTaskStatus } from "../api/client";

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void;
}

const PRIORITY_ICONS: Record<Task["priority"], string> = {
  urgent: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "🟢",
};

export default function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "completed";

  const handleStatusChange = async (newStatus: Task["status"]) => {
    if (newStatus === task.status) return;
    setUpdating(true);
    setError(null);
    try {
      await updateTaskStatus(task.id, newStatus);
      onStatusChange(task.id, newStatus);
    } catch {
      setError("Failed to update");
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={`task-card glass-card ${task.status === "completed" ? "task-completed" : ""} ${isOverdue ? "task-overdue" : ""} ${updating ? "task-updating" : ""}`}
    >
      <div className="task-header">
        <div className="task-title-row">
          <span className="task-priority-icon">
            {PRIORITY_ICONS[task.priority]}
          </span>
          <h4 className="task-title">{task.title}</h4>
        </div>
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-footer">
        <div className="task-meta">
          <span className={`task-due ${isOverdue ? "task-due-overdue" : ""}`}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {isOverdue ? "Overdue: " : "Due: "}
            {formatDate(task.dueDate)}
          </span>
        </div>

        <div className="task-status-control">
          {error && <span className="task-error">{error}</span>}
          <div className="status-capsule-row">
            <button
              className={`status-capsule-btn ${task.status === "todo" ? "active-todo" : ""}`}
              onClick={() => handleStatusChange("todo")}
              disabled={updating}
            >
              Todo
            </button>
            <button
              className={`status-capsule-btn ${task.status === "in_progress" ? "active-in_progress" : ""}`}
              onClick={() => handleStatusChange("in_progress")}
              disabled={updating}
            >
              Active
            </button>
            <button
              className={`status-capsule-btn ${task.status === "completed" ? "active-completed" : ""}`}
              onClick={() => handleStatusChange("completed")}
              disabled={updating}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
