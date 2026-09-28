import Todo from '../models/todo.model.js';

export const getAllTodos = async () => {
  return await Todo.find().sort({ createdAt: -1 });
};

export const createTodo = async (todoText) => {
  const newTodo = new Todo({
    todo: todoText.trim(),
    isCompleted: false,
  });
  return await newTodo.save();
};

export const updateTodoById = async (id, updates) => {
  const cleanUpdates = {};
  if (updates.todo !== undefined) {
    cleanUpdates.todo = updates.todo.trim();
  }
  if (updates.isCompleted !== undefined) {
    cleanUpdates.isCompleted = Boolean(updates.isCompleted);
  }

  return await Todo.findByIdAndUpdate(id, cleanUpdates, {
    new: true,
    runValidators: true,
  });
};

export const deleteTodoById = async (id) => {
  return await Todo.findByIdAndDelete(id);
};

export const clearCompletedTodos = async () => {
  return await Todo.deleteMany({ isCompleted: true });
};
