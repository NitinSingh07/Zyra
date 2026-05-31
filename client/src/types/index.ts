export interface Student {
  id: string;
  name: string;
  email: string;
  grade: number;
  gpa: number;
  counselorId: string;
  enrollmentStatus: "active" | "at_risk" | "inactive";
}

export interface StudentListItem {
  id: string;
  name: string;
  grade: number;
  enrollmentStatus: string;
}

export interface Task {
  id: string;
  studentId: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  priority: "urgent" | "high" | "medium" | "low";
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  studentId: string;
  from: string;
  subject: string;
  preview: string;
  read: boolean;
  receivedAt: string;
}

export type UrgencyLevel = "critical" | "high" | "medium" | "low";

export interface ActionCenterSummary {
  totalTasks: number;
  completedTasks: number;
  urgentTasks: number;
  overdueTasks: number;
  unreadMessages: number;
  urgencyLevel: UrgencyLevel;
}

export interface ActionCenterResponse {
  student: Student;
  tasks: Task[];
  messages: Message[];
  summary: ActionCenterSummary;
}
