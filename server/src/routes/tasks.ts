import { Router, Request, Response } from "express";
import { tasks } from "../data/mockData.js";

const router = Router();

const VALID_STATUSES = ["todo", "in_progress", "completed"] as const;

router.patch("/:taskId/status", (req: Request, res: Response): void => {
  const task = tasks.find((t) => t.id === req.params.taskId);

  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    res
      .status(400)
      .json({
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    return;
  }

  task.status = status;
  task.updatedAt = new Date().toISOString();

  res.json(task);
});

export default router;
