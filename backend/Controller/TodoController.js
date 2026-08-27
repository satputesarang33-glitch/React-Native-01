import mongoose from "mongoose";
import Todo from "../Models/TodoModels.js";

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function getTodos(req, res) {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json({ data: todos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createTodo(req, res) {
  try {
    const title = req.body.title?.trim() || "";
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const newTodo = await Todo.create({ title });
    res.status(201).json({ data: newTodo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateTodo(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid todo id" });
    }

    const { title, completed } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (title.trim().length === 0) {
        return res.status(400).json({ message: "Title is required" });
      }
      updates.title = title.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({ message: "Completed must be a boolean" });
      }
      updates.completed = completed;
    }

    const updatedTodo = await Todo.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ data: updatedTodo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteTodo(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid todo id" });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
