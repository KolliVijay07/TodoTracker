import { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import { MdDeleteSweep, MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md';
import { FaEdit, FaTimes, FaCheck, FaSync } from 'react-icons/fa';
import { todoService } from './services/todoService';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showFinished, setShowFinished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch todos on mount
  useEffect(() => {
    let ignore = false;
    todoService
      .getTodos()
      .then((data) => {
        if (!ignore) {
          setTodos(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || 'Could not connect to database backend.');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Manual refresh action triggered by user
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Could not connect to database backend.');
    } finally {
      setLoading(false);
    }
  };

  // Form submit: handles both Add new task and Update existing task
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = todo.trim();
    if (!trimmed) return;

    try {
      setSubmitting(true);
      if (editingId) {
        // Update task
        const updated = await todoService.updateTodo(editingId, { todo: trimmed });
        setTodos((prev) =>
          prev.map((item) => ((item.id || item._id) === editingId ? updated : item))
        );
        setEditingId(null);
      } else {
        // Add new task
        const newTodo = await todoService.addTodo(trimmed);
        setTodos((prev) => [newTodo, ...prev]);
      }
      setTodo('');
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Initiate edit mode without deleting the task
  const handleStartEdit = (item) => {
    const id = item.id || item._id;
    setEditingId(id);
    setTodo(item.todo);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setTodo('');
  };

  // Delete a task
  const handleDelete = async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos((prev) => prev.filter((item) => (item.id || item._id) !== id));
      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete task');
    }
  };

  // Toggle task completion status
  const handleToggle = async (item) => {
    const id = item.id || item._id;
    const newStatus = !item.isCompleted;

    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => ((t.id || t._id) === id ? { ...t, isCompleted: newStatus } : t))
    );

    try {
      await todoService.updateTodo(id, { isCompleted: newStatus });
    } catch (err) {
      // Revert if request fails
      setTodos((prev) =>
        prev.map((t) => ((t.id || t._id) === id ? { ...t, isCompleted: !newStatus } : t))
      );
      alert(err.message || 'Failed to update task status');
    }
  };

  // Clear completed tasks
  const handleClearCompleted = async () => {
    const completedCount = todos.filter((t) => t.isCompleted).length;
    if (completedCount === 0) return;

    if (!window.confirm(`Are you sure you want to clear ${completedCount} completed task(s)?`)) {
      return;
    }

    try {
      await todoService.clearCompleted();
      setTodos((prev) => prev.filter((t) => !t.isCompleted));
    } catch (err) {
      alert(err.message || 'Failed to clear completed tasks');
    }
  };

  // Counts and filtered list
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.isCompleted).length;
  const filteredTodos = todos.filter((item) => showFinished || !item.isCompleted);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
          
          {/* Header & Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-indigo-600 tracking-tight">Task Manager</h2>
              <p className="text-sm text-slate-500 mt-1">Organize your daily Tasks</p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {completedCount} of {totalCount} completed
              </span>
              <button
                onClick={handleRefresh}
                title="Refresh tasks"
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
              >
                <FaSync className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-sm">
                <span className="font-bold">Database Notice: </span>
                {error}
              </div>
              <button
                onClick={handleRefresh}
                className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Add / Edit Task Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              {editingId ? 'Edit Task' : 'Add New Task'}
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 border-2 border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={todo.trim().length === 0 || submitting}
                  className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium px-6 py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {editingId ? (
                    <>
                      <FaCheck /> Update
                    </>
                  ) : (
                    'Add Task'
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FaTimes /> Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Filter & Bulk Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-slate-100 mb-6 text-sm">
            <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showFinished}
                onChange={() => setShowFinished(!showFinished)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span>Show Finished Tasks</span>
            </label>

            {completedCount > 0 && (
              <button
                onClick={handleClearCompleted}
                className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline cursor-pointer"
              >
                Clear completed ({completedCount})
              </button>
            )}
          </div>

          {/* Tasks List */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Your Tasks</h3>

            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-400 gap-3">
                <FaSync className="animate-spin text-xl text-indigo-500" />
                <span>Loading tasks from database...</span>
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-300">
                <p className="text-slate-500 text-base font-medium">No tasks available</p>
                <p className="text-slate-400 text-xs mt-1">Add a task above to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((item) => {
                  const id = item.id || item._id;
                  const isEditingThis = editingId === id;

                  return (
                    <div
                      key={id}
                      className={`group rounded-xl border p-4 flex items-center justify-between gap-4 transition ${
                        isEditingThis
                          ? 'border-indigo-400 bg-indigo-50/50 shadow-sm'
                          : item.isCompleted
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div
                        onClick={() => handleToggle(item)}
                        className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer select-none"
                      >
                        <button
                          type="button"
                          aria-label={item.isCompleted ? 'Mark incomplete' : 'Mark completed'}
                          className="text-xl text-indigo-600 hover:text-indigo-700 flex-shrink-0"
                        >
                          {item.isCompleted ? (
                            <MdCheckCircle className="text-emerald-500" />
                          ) : (
                            <MdRadioButtonUnchecked className="text-slate-400 hover:text-indigo-600" />
                          )}
                        </button>
                        <span
                          className={`text-base font-medium break-words leading-relaxed transition ${
                            item.isCompleted
                              ? 'line-through text-slate-400'
                              : 'text-slate-800'
                          }`}
                        >
                          {item.todo}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleStartEdit(item)}
                          title="Edit Task"
                          aria-label="Edit Task"
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          title="Delete Task"
                          aria-label="Delete Task"
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        >
                          <MdDeleteSweep size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
