const API_BASE = '/api/todos';

export const todoService = {
  // Fetch all tasks
  async getTodos() {
    const res = await fetch(API_BASE);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch tasks from server');
    }
    return res.json();
  },

  // Create a new task
  async addTodo(todoText) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ todo: todoText }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to add task');
    }
    return res.json();
  },

  // Update a task (edit text or toggle status)
  async updateTodo(id, updates) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update task');
    }
    return res.json();
  },

  // Delete a task
  async deleteTodo(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete task');
    }
    return res.json();
  },

  // Clear all completed tasks
  async clearCompleted() {
    const res = await fetch(`${API_BASE}?completed=true`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to clear completed tasks');
    }
    return res.json();
  },

  // Check backend & DB health
  async checkHealth() {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },
};
