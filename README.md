# Zyra — Counselor Student Action Center

A premium, highly interactive dashboard designed for school counselors to instantly monitor student performance status, prioritize critical student tasks, review urgent incoming communications, and update actions in real-time.

---

## 🏗️ Architecture & Project Structure

The project is structured as a full-stack monorepo:

```
Demo/
├── server/                     # Express.js + Node.js + TypeScript Backend
│   ├── src/
│   │   ├── index.ts            # Server configuration & middleware entrypoint
│   │   ├── data/
│   │   │   └── mockData.ts     # In-memory typed student database
│   │   ├── routes/
│   │   │   ├── students.ts     # Action center composite state logic
│   │   │   └── tasks.ts        # Task status update mutations
│   │   └── types/
│   │       └── index.ts        # Shared TypeScript domain contracts
│
├── client/                     # Vite + React + TypeScript Frontend
│   └── src/
│       ├── App.tsx             # Interactive dashboard controller
│       ├── index.css           # Custom theme variables, global styles, glassmorphism
│       ├── api/
│       │   └── client.ts       # Typed fetch wrapper and endpoint mappings
│       └── components/         # Modular dashboard view widgets
```

### Key Decisions
- **In-Memory Store**: Mock data is held in-memory on the Node server, allowing real-time mutations (`PATCH /tasks/:id/status`) to persist for the duration of the server session.
- **Composite Fetching**: The `GET /students/:id/action-center` endpoint aggregates student profiles, structured tasks, sorted message timelines, and calculates real-time metrics (overdue count, unread count, global urgency level) to minimize frontend client roundtrips.
- **Strict Typing**: TypeScript types are synchronized between backend schemas and frontend UI models to guarantee type safety.

---

##  API Contract

### 1. `GET /students`
*Fetches a summary list of all registered students for selector dropdowns.*

- **Response Header**: `200 OK`
- **Response Body**:
```json
[
  {
    "id": "stu_001",
    "name": "Maya Patel",
    "grade": 11,
    "enrollmentStatus": "at_risk"
  }
]
```

### 2. `GET /students/:id/action-center`
*Aggregates detailed composite metrics, tasks, and messages for a specific student.*

- **Response Header**: `200 OK` (or `404 Not Found` if student ID doesn't exist)
- **Response Body**:
```json
{
  "student": {
    "id": "stu_001",
    "name": "Maya Patel",
    "email": "maya.patel@school.edu",
    "grade": 11,
    "gpa": 3.2,
    "counselorId": "csl_001",
    "enrollmentStatus": "at_risk"
  },
  "tasks": [
    {
      "id": "tsk_001",
      "studentId": "stu_001",
      "title": "Submit FAFSA application",
      "description": "Deadline is approaching.",
      "status": "todo",
      "priority": "urgent",
      "dueDate": "2026-06-05",
      "createdAt": "2026-05-13T14:00:00Z",
      "updatedAt": "2026-05-13T14:00:00Z"
    }
  ],
  "messages": [
    {
      "id": "msg_001",
      "studentId": "stu_001",
      "from": "Mrs. Thompson (Math)",
      "subject": "Maya missing assignments",
      "preview": "Maya has not submitted...",
      "read": false,
      "receivedAt": "2026-05-30T08:30:00Z"
    }
  ],
  "summary": {
    "totalTasks": 5,
    "completedTasks": 1,
    "urgentTasks": 2,
    "overdueTasks": 1,
    "unreadMessages": 2,
    "urgencyLevel": "critical"
  }
}
```

### 3. `PATCH /tasks/:taskId/status`
*Mutates the status of a specific task.*

- **Request Body**:
```json
{
  "status": "in_progress" // accepted: "todo" | "in_progress" | "completed"
}
```
- **Response Header**: `200 OK` (or `400 Bad Request` on invalid status, `404 Not Found` on invalid ID)
- **Response Body**:
```json
{
  "id": "tsk_001",
  "studentId": "stu_001",
  "title": "Submit FAFSA application",
  "status": "in_progress",
  "priority": "urgent",
  "dueDate": "2026-06-05",
  "createdAt": "2026-05-13T14:00:00Z",
  "updatedAt": "2026-05-31T16:35:05Z"
}
```

---

## 🚀 Setup & Execution Instructions

Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 1. Initialize and Run the Backend API
```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Run the TypeScript server in development (watching files)
npm run dev
# The API will be available at http://localhost:3001
```

### 2. Initialize and Run the React Dashboard
Open a new terminal tab/window:
```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start the Vite bundler dev server
npm run dev
# The UI will be available at http://localhost:5173
```
