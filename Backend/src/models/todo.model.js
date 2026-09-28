import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    todo: {
      type: String,
      required: [true, 'Task content is required'],
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

const Todo = mongoose.model('Todo', todoSchema);
export default Todo;
