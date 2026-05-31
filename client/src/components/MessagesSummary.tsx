import type { Message } from "../types";

interface MessagesSummaryProps {
  messages: Message[];
  unreadCount: number;
}

export default function MessagesSummary({
  messages,
  unreadCount,
}: MessagesSummaryProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="messages-section">
      <div className="section-header">
        <h3 className="section-title">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Messages
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </h3>
      </div>

      <div className="messages-list">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-item glass-card ${!msg.read ? "message-unread" : ""}`}
          >
            <div className="message-header">
              <div className="message-from-row">
                {!msg.read && <span className="unread-dot" />}
                <span className="message-from">{msg.from}</span>
              </div>
              <span className="message-time">
                {formatDate(msg.receivedAt)}
              </span>
            </div>
            <h4 className="message-subject">{msg.subject}</h4>
            <p className="message-preview">{msg.preview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
