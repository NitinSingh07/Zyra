const BASE_URL = "http://localhost:3001";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      body.error || `Request failed with status ${res.status}`,
      res.status
    );
  }

  return res.json();
}

export function getStudents() {
  return request<
    { id: string; name: string; grade: number; enrollmentStatus: string }[]
  >("/students");
}

export function getActionCenter(studentId: string) {
  return request<import("../types").ActionCenterResponse>(
    `/students/${studentId}/action-center`
  );
}

export function updateTaskStatus(
  taskId: string,
  status: "todo" | "in_progress" | "completed"
) {
  return request<import("../types").Task>(`/tasks/${taskId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
