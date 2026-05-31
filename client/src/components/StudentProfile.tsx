import type { Student, ActionCenterSummary } from "../types";
import UrgencyBadge from "./UrgencyBadge";

interface StudentProfileProps {
  student: Student;
  summary: ActionCenterSummary;
}

export default function StudentProfile({
  student,
  summary,
}: StudentProfileProps) {
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="profile-card glass-card">
      <div className="profile-header">
        <div className="profile-avatar-lg">
          <span>{initials}</span>
        </div>
        <div className="profile-details">
          <div className="profile-name-row">
            <h2 className="profile-name">{student.name}</h2>
            <UrgencyBadge
              level={summary.urgencyLevel}
              size="lg"
              pulse={
                summary.urgencyLevel === "critical" ||
                summary.urgencyLevel === "high"
              }
            />
          </div>
          <p className="profile-email">{student.email}</p>
          <div className="profile-tags">
            <span className="profile-tag">Grade {student.grade}</span>
            <span className="profile-tag">GPA {student.gpa.toFixed(1)}</span>
            <span
              className={`profile-tag profile-enrollment profile-enrollment-${student.enrollmentStatus}`}
            >
              {student.enrollmentStatus === "at_risk"
                ? "At Risk"
                : student.enrollmentStatus === "active"
                  ? "Active"
                  : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">{summary.totalTasks}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-item">
          <span className="stat-value stat-completed">
            {summary.completedTasks}
          </span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-value stat-urgent">{summary.urgentTasks}</span>
          <span className="stat-label">Urgent</span>
        </div>
        <div className="stat-item">
          <span className="stat-value stat-overdue">
            {summary.overdueTasks}
          </span>
          <span className="stat-label">Overdue</span>
        </div>
        <div className="stat-item">
          <span className="stat-value stat-unread">
            {summary.unreadMessages}
          </span>
          <span className="stat-label">Unread</span>
        </div>
      </div>
    </div>
  );
}
