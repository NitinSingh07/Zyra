import { useState, useEffect, useCallback } from "react";
import type { ActionCenterResponse, Task } from "./types";
import { getStudents, getActionCenter } from "./api/client";
import StudentSelector from "./components/StudentSelector";
import StudentProfile from "./components/StudentProfile";
import TaskList from "./components/TaskList";
import MessagesSummary from "./components/MessagesSummary";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

interface StudentListItem {
  id: string;
  name: string;
  grade: number;
  enrollmentStatus: string;
}

function App() {
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [data, setData] = useState<ActionCenterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch student list on mount
  useEffect(() => {
    getStudents()
      .then((list) => {
        setStudents(list);
        if (list.length > 0) {
          setSelectedId(list[0].id);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load students");
        setLoading(false);
      });
  }, []);

  // Fetch action center when selected student changes
  const fetchActionCenter = useCallback(async () => {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getActionCenter(selectedId);
      setData(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load action center";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    fetchActionCenter();
  }, [fetchActionCenter]);

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    if (!data) return;
    setData({
      ...data,
      tasks: data.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
          : t
      ),
      summary: {
        ...data.summary,
        completedTasks:
          data.summary.completedTasks +
          (newStatus === "completed"
            ? 1
            : data.tasks.find((t) => t.id === taskId)?.status === "completed"
              ? -1
              : 0),
      },
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="header-logo">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h1 className="header-title">Student Action Center</h1>
              <p className="header-subtitle">Counselor Dashboard</p>
            </div>
          </div>
          <div className="header-timestamp">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </header>

      <main className="app-main">
        {students.length > 0 && (
          <StudentSelector
            students={students}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}

        {loading && <LoadingState />}

        {error && !loading && (
          <ErrorState message={error} onRetry={fetchActionCenter} />
        )}

        {data && !loading && !error && (
          <div className="action-center">
            <StudentProfile
              student={data.student}
              summary={data.summary}
            />
            <div className="action-grid">
              <TaskList
                tasks={data.tasks}
                onStatusChange={handleStatusChange}
              />
              <MessagesSummary
                messages={data.messages}
                unreadCount={data.summary.unreadMessages}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
