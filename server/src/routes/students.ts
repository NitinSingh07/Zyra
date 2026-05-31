import { Router, Request, Response } from "express";
import { students, tasks, messages } from "../data/mockData.js";
import { UrgencyLevel, ActionCenterResponse } from "../types/index.js";

const router = Router();

function computeUrgencyLevel(
  enrollmentStatus: string,
  studentTasks: typeof tasks
): UrgencyLevel {
  const now = new Date();
  const incompleteTasks = studentTasks.filter((t) => t.status !== "completed");
  const urgentOrOverdue = incompleteTasks.filter(
    (t) => t.priority === "urgent" || new Date(t.dueDate) < now
  );
  const highPriority = incompleteTasks.filter((t) => t.priority === "high");

  if (enrollmentStatus === "at_risk" && urgentOrOverdue.length >= 2) {
    return "critical";
  }
  if (urgentOrOverdue.length > 0) {
    return "high";
  }
  if (highPriority.length > 0) {
    return "medium";
  }
  return "low";
}

router.get("/:id/action-center", (req: Request, res: Response): void => {
  const student = students.find((s) => s.id === req.params.id);

  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  const studentTasks = tasks.filter((t) => t.studentId === student.id);
  const studentMessages = messages.filter((m) => m.studentId === student.id);

  const now = new Date();
  const completedTasks = studentTasks.filter(
    (t) => t.status === "completed"
  ).length;
  const urgentTasks = studentTasks.filter(
    (t) => t.priority === "urgent" && t.status !== "completed"
  ).length;
  const overdueTasks = studentTasks.filter(
    (t) => new Date(t.dueDate) < now && t.status !== "completed"
  ).length;
  const unreadMessages = studentMessages.filter((m) => !m.read).length;

  // Sort tasks: priority order (urgent > high > medium > low), then by due date
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  const sortedTasks = [...studentTasks].sort((a, b) => {
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pDiff !== 0) return pDiff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const response: ActionCenterResponse = {
    student,
    tasks: sortedTasks,
    messages: studentMessages.sort(
      (a, b) =>
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    ),
    summary: {
      totalTasks: studentTasks.length,
      completedTasks,
      urgentTasks,
      overdueTasks,
      unreadMessages,
      urgencyLevel: computeUrgencyLevel(student.enrollmentStatus, studentTasks),
    },
  };

  res.json(response);
});

// Also expose a list endpoint so the frontend can populate the student selector
router.get("/", (_req: Request, res: Response): void => {
  res.json(
    students.map((s) => ({
      id: s.id,
      name: s.name,
      grade: s.grade,
      enrollmentStatus: s.enrollmentStatus,
    }))
  );
});

export default router;
