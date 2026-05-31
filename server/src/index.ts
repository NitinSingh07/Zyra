import express from "express";
import cors from "cors";
import studentRoutes from "./routes/students.js";
import taskRoutes from "./routes/tasks.js";

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  })
);
app.use(express.json());

app.use("/students", studentRoutes);
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Action Center API running at http://localhost:${PORT}`);
});
