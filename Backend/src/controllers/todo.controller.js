import * as todoService from '../services/todo.service.js';

export const getTodos = async (_req, res, next) => {
  try {
    const todos = await todoService.getAllTodos();
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

export const createTodo = async (req, res, next) => {
  try {
    const { todo } = req.body;
    if (!todo || typeof todo !== 'string' || todo.trim() === '') {
      return res.status(400).json({ message: 'Task text cannot be empty' });
    }
    const created = await todoService.createTodo(todo);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { todo, isCompleted } = req.body;

    if (todo !== undefined && (typeof todo !== 'string' || todo.trim() === '')) {
      return res.status(400).json({ message: 'Task text cannot be empty' });
    }

    const updated = await todoService.updateTodoById(id, { todo, isCompleted });
    if (!updated) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await todoService.deleteTodoById(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', id });
  } catch (error) {
    next(error);
  }
};

export const clearCompleted = async (req, res, next) => {
  try {
    if (req.query.completed === 'true') {
      const result = await todoService.clearCompletedTodos();
      return res.json({ message: 'Completed tasks removed', count: result.deletedCount });
    }
    res.status(400).json({ message: 'Specify ?completed=true to clear completed tasks' });
  } catch (error) {
    next(error);
  }
};
