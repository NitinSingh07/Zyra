interface StudentSelectorProps {
  students: { id: string; name: string; grade: number; enrollmentStatus: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function StudentSelector({
  students,
  selectedId,
  onSelect,
}: StudentSelectorProps) {
  return (
    <div className="student-selector">
      {students.map((s) => (
        <button
          key={s.id}
          className={`selector-tab ${selectedId === s.id ? "selector-active" : ""}`}
          onClick={() => onSelect(s.id)}
        >
          <span className="selector-avatar">
            {s.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
          <div className="selector-info">
            <span className="selector-name">{s.name}</span>
            <span className="selector-meta">
              Grade {s.grade}
              {s.enrollmentStatus === "at_risk" && (
                <span className="selector-risk">At Risk</span>
              )}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
