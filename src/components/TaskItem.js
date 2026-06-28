import React, { useState } from 'react';
import './TaskItem.css';

function TaskItem({ task, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(task);

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = () => {
    onUpdateTask(task._id, editData);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus) => {
    onUpdateTask(task._id, { ...task, status: newStatus });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      work: '💼',
      personal: '👤',
      shopping: '🛒',
      health: '💪',
      other: '📌',
    };
    return emojis[category] || '📌';
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      pending: '⏳',
      'in-progress': '🔄',
      completed: '✓',
    };
    return emojis[status] || '📝';
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  if (isEditing) {
    return (
      <div className="task-item editing">
        <div className="edit-form">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => handleEditChange('title', e.target.value)}
            placeholder="Task title"
            maxLength="100"
          />
          <textarea
            value={editData.description}
            onChange={(e) => handleEditChange('description', e.target.value)}
            placeholder="Task description"
            maxLength="500"
          />
          <div className="edit-row">
            <select
              value={editData.priority}
              onChange={(e) => handleEditChange('priority', e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={editData.status}
              onChange={(e) => handleEditChange('status', e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={editData.category}
              onChange={(e) => handleEditChange('category', e.target.value)}
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>
          </div>
          <input
            type="date"
            value={editData.dueDate ? editData.dueDate.split('T')[0] : ''}
            onChange={(e) => handleEditChange('dueDate', e.target.value)}
          />
          <div className="edit-buttons">
            <button onClick={handleSaveEdit} className="btn-save">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`task-item ${task.status} ${
        isOverdue(task.dueDate, task.status) ? 'overdue' : ''
      }`}
    >
      <div className="task-header">
        <div className="task-title-section">
          <span
            className="priority-indicator"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
            title={`Priority: ${task.priority}`}
          ></span>
          <h3
            className={`task-title ${
              task.status === 'completed' ? 'completed' : ''
            }`}
          >
            {task.title}
          </h3>
          <span className="category-badge">
            {getCategoryEmoji(task.category)} {task.category}
          </span>
        </div>
        <div className="task-meta">
          <span className="status-badge" title="Status">
            {getStatusEmoji(task.status)} {task.status}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        <div className="task-info">
          <span className={`due-date ${isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}>
            📅 {formatDate(task.dueDate)}
          </span>
        </div>

        <div className="task-actions">
          {task.status !== 'completed' ? (
            <button
              onClick={() => handleStatusChange('completed')}
              className="btn-action btn-complete"
              title="Mark as completed"
            >
              ✓
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange('pending')}
              className="btn-action btn-undo"
              title="Mark as pending"
            >
              ↶
            </button>
          )}

          {task.status === 'pending' && (
            <button
              onClick={() => handleStatusChange('in-progress')}
              className="btn-action btn-progress"
              title="Start task"
            >
              ▶
            </button>
          )}

          <button
            onClick={() => setIsEditing(true)}
            className="btn-action btn-edit"
            title="Edit task"
          >
            ✏️
          </button>

          <button
            onClick={() => onDeleteTask(task._id)}
            className="btn-action btn-delete"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
