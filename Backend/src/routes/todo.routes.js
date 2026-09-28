import express from 'express';
import * as todoController from '../controllers/todo.controller.js';

const router = express.Router();

router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);
router.delete('/', todoController.clearCompleted);

export default router;
