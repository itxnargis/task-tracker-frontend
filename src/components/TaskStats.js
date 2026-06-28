import React from "react";
import "./TaskStats.css";

function TaskStats({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in-progress",
  ).length;
  const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === "completed") return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const tasksByCategory = {
    work: tasks.filter((t) => t.category === "work").length,
    personal: tasks.filter((t) => t.category === "personal").length,
    shopping: tasks.filter((t) => t.category === "shopping").length,
    health: tasks.filter((t) => t.category === "health").length,
    other: tasks.filter((t) => t.category === "other").length,
  };

  return (
    <div className="task-stats">
      <div className="stats-header">
        <h2>📊 Statistics</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-value">{totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>

        <div className="stat-card completed">
          <div className="stat-value">{completedTasks}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card pending">
          <div className="stat-value">{pendingTasks}</div>
          <div className="stat-label">Pending</div>
        </div>

        <div className="stat-card progress">
          <div className="stat-value">{inProgressTasks}</div>
          <div className="stat-label">In Progress</div>
        </div>

        <div className="stat-card high-priority">
          <div className="stat-value">{highPriorityTasks}</div>
          <div className="stat-label">High Priority</div>
        </div>

        <div className="stat-card overdue">
          <div className="stat-value">{overdueTasks}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      <div className="stats-section">
        <h3>📈 Completion Rate</h3>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="progress-text">{completionRate}%</div>
        </div>
      </div>

      <div className="stats-section">
        <h3>🏷️ By Category</h3>
        <div className="category-list">
          {Object.entries(tasksByCategory).map(([category, count]) =>
            count > 0 ? (
              <div key={category} className="category-item">
                <span className="category-name">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                <span className="category-count">{count}</span>
              </div>
            ) : null,
          )}
          {Object.values(tasksByCategory).every((count) => count === 0) && (
            <p className="no-tasks">No tasks yet</p>
          )}
        </div>
      </div>

      <div className="stats-section productivity">
        <h3>🎯 Productivity Tips</h3>
        <ul className="tips-list">
          <li>
            {highPriorityTasks > 0
              ? `You have ${highPriorityTasks} high priority task(s) to tackle!`
              : "Great! No high priority tasks pending."}
          </li>
          <li>
            {overdueTasks > 0
              ? `⚠️ ${overdueTasks} task(s) are overdue. Check them out!`
              : "✓ No overdue tasks. You're on track!"}
          </li>
          <li>
            {completionRate > 50
              ? `🚀 Awesome progress! You've completed ${completionRate}% of tasks.`
              : "Keep pushing! Try to complete more tasks."}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TaskStats;
