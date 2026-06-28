import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskStats from "./components/TaskStats";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5001/api/tasks";

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const fetchTasks = useCallback(
    async ({ showLoader = true } = {}) => {
      if (showLoader) setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterType !== "all") {
          if (filterType.startsWith("priority-")) {
            params.append("priority", filterType.replace("priority-", ""));
          } else if (filterType.startsWith("status-")) {
            params.append("status", filterType.replace("status-", ""));
          } else if (filterType.startsWith("category-")) {
            params.append("category", filterType.replace("category-", ""));
          }
        }
        if (sortBy && sortBy !== "newest") {
          params.append("sortBy", sortBy);
        }
        const response = await axios.get(API_URL, { params });
        setTasks((prev) => {
          const incoming = JSON.stringify(response.data);
          const current = JSON.stringify(prev);
          return incoming === current ? prev : response.data;
        });
      } catch (error) {
        if (showLoader) toast.error("Failed to fetch tasks");
        console.error("Error fetching tasks:", error);
      } finally {
        if (showLoader) setIsLoading(false);
      }
    },
    [filterType, sortBy],
  );

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(
      () => fetchTasks({ showLoader: false }),
      30000,
    );
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const handleAddTask = async (taskData) => {
    try {
      const response = await axios.post(API_URL, taskData);
      setTasks((prev) => [response.data, ...prev]);
      toast.success("✓ Task added successfully!");
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add task");
    }
  };

  const handleUpdateTask = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response.data : task)),
      );
      toast.success("✓ Task updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success("✓ Task deleted successfully!");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      task.title?.toLowerCase().includes(q) ||
      task.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>✓ Task Tracker Pro</h1>
            <p>Organize, prioritize, and conquer your tasks</p>
          </div>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="layout-grid">
            <aside className="sidebar">
              <TaskStats tasks={tasks} />
            </aside>

            <div className="main-content">
              <section className="form-section">
                <div className="form-section-header">
                  <span className="form-section-title">
                    {tasks.length > 0
                      ? `${filteredTasks.length} task${filteredTasks.length !== 1 ? "s" : ""}`
                      : "No tasks yet"}
                  </span>
                  <button
                    className={`btn-new-task${showForm ? " active" : ""}`}
                    onClick={() => setShowForm((s) => !s)}
                    aria-expanded={showForm}
                  >
                    {showForm ? "✕ Cancel" : "+ New Task"}
                  </button>
                </div>

                {showForm && (
                  <div className="form-body">
                    <TaskForm onAddTask={handleAddTask} />
                  </div>
                )}
              </section>

              <section className="controls-section">
                <input
                  type="text"
                  placeholder="🔍 Search tasks..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="search-input"
                />
                <div className="filter-controls">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Tasks</option>
                    <optgroup label="Priority">
                      <option value="priority-high">High Priority</option>
                      <option value="priority-medium">Medium Priority</option>
                      <option value="priority-low">Low Priority</option>
                    </optgroup>
                    <optgroup label="Status">
                      <option value="status-pending">Pending</option>
                      <option value="status-in-progress">In Progress</option>
                      <option value="status-completed">Completed</option>
                    </optgroup>
                    <optgroup label="Category">
                      <option value="category-work">Work</option>
                      <option value="category-personal">Personal</option>
                      <option value="category-shopping">Shopping</option>
                      <option value="category-health">Health</option>
                      <option value="category-other">Other</option>
                    </optgroup>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="newest">Newest First</option>
                    <option value="priority">By Priority</option>
                    <option value="dueDate">By Due Date</option>
                  </select>
                </div>
              </section>

              <section className="tasks-section">
                {isLoading ? (
                  <div className="loading">
                    <div className="spinner" />
                    Loading tasks…
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <p>
                      {filter
                        ? "No tasks match your search"
                        : 'No tasks yet. Hit "+ New Task" above to get started!'}
                    </p>
                  </div>
                ) : (
                  <TaskList
                    tasks={filteredTasks}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                  />
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </div>
  );
}

export default App;
