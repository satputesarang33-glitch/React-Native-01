import React, { useEffect, useState } from "react";

import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../services/todoApi";

export default function Index() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  // =========================
  // GET TODOS
  // =========================

  const loadTodos = async () => {
    try {
      const data = await getTodos();

      setTodos(data);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  };

  // =========================
  // CREATE TODO
  // =========================

  const handleCreateTodo = async () => {
    if (!title.trim()) {
      Alert.alert("Warning", "Enter todo title");
      return;
    }

    try {
      const newTodo = await createTodo(title.trim());

      setTodos((oldTodos) => [newTodo, ...oldTodos]);

      setTitle("");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  };

  // =========================
  // START EDIT
  // =========================

  const startEdit = (todo) => {
    setTitle(todo.title);

    setEditingId(todo._id);
  };

  // =========================
  // UPDATE TODO
  // =========================

  const handleUpdateTodo = async () => {
    if (!title.trim()) {
      Alert.alert("Warning", "Enter todo title");
      return;
    }

    if (!editingId) {
      Alert.alert("Error", "Todo ID not found");
      return;
    }

    try {
      const updatedTodo = await updateTodo(editingId, {
        title: title.trim(),
      });

      setTodos((oldTodos) =>
        oldTodos.map((todo) => (todo._id === editingId ? updatedTodo : todo)),
      );

      setTitle("");

      setEditingId(null);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  };

  // =========================
  // COMPLETE / INCOMPLETE
  // =========================

  const toggleTodo = async (todo) => {
    try {
      const updatedTodo = await updateTodo(todo._id, {
        completed: !todo.completed,
      });

      setTodos((oldTodos) =>
        oldTodos.map((item) => (item._id === todo._id ? updatedTodo : item)),
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  };

  // =========================
  // DELETE TODO
  // =========================

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);

      setTodos((oldTodos) => oldTodos.filter((todo) => todo._id !== id));

      if (editingId === id) {
        setEditingId(null);
        setTitle("");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  };

  // =========================
  // DELETE CONFIRMATION
  // =========================

  const confirmDelete = (todo) => {
    Alert.alert("Delete Todo", `Delete "${todo.title}"?`, [
      {
        text: "Cancel",
        style: "cancel",
      },

      {
        text: "Delete",
        style: "destructive",

        onPress: () => handleDelete(todo._id),
      },
    ]);
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {
    setEditingId(null);

    setTitle("");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Heading */}

      <Text style={styles.heading}>Todo App</Text>

      {/* Input Form */}

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={editingId ? "Update todo" : "Enter todo"}
          value={title}
          onChangeText={setTitle}
        />

        {/* CREATE BUTTON */}

        {!editingId && (
          <TouchableOpacity style={styles.button} onPress={handleCreateTodo}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        )}

        {/* UPDATE BUTTON */}

        {editingId && (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateTodo}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* CANCEL EDIT BUTTON */}

      {editingId && (
        <TouchableOpacity onPress={cancelEdit}>
          <Text style={styles.cancel}>Cancel Edit</Text>
        </TouchableOpacity>
      )}

      {/* TODO LIST */}

      <FlatList
        data={todos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.todo}>
            {/* COMPLETE / INCOMPLETE */}

            <TouchableOpacity
              style={styles.todoContent}
              onPress={() => toggleTodo(item)}
            >
              <Text
                style={[styles.todoTitle, item.completed && styles.completed]}
              >
                {item.completed ? "✓ " : ""}

                {item.title}
              </Text>
            </TouchableOpacity>

            {/* EDIT */}

            <TouchableOpacity onPress={() => startEdit(item)}>
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>

            {/* DELETE */}

            <TouchableOpacity onPress={() => confirmDelete(item)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// =========================
// STYLES
// =========================

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#f5f5f5",

    padding: 20,
  },

  heading: {
    fontSize: 32,

    fontWeight: "bold",

    marginBottom: 20,
  },

  form: {
    flexDirection: "row",

    marginBottom: 15,
  },

  input: {
    flex: 1,

    backgroundColor: "white",

    borderWidth: 1,

    borderColor: "#ddd",

    padding: 12,

    borderRadius: 8,
  },

  button: {
    backgroundColor: "#5b5bf7",

    paddingHorizontal: 20,

    justifyContent: "center",

    marginLeft: 10,

    borderRadius: 8,
  },

  updateButton: {
    backgroundColor: "green",

    paddingHorizontal: 20,

    justifyContent: "center",

    marginLeft: 10,

    borderRadius: 8,
  },

  buttonText: {
    color: "white",

    fontWeight: "bold",
  },

  cancel: {
    color: "#5b5bf7",

    marginBottom: 15,

    fontWeight: "600",
  },

  todo: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "white",

    padding: 15,

    marginBottom: 10,

    borderRadius: 10,
  },

  todoContent: {
    flex: 1,
  },

  todoTitle: {
    fontSize: 16,
  },

  completed: {
    textDecorationLine: "line-through",

    color: "#999",
  },

  edit: {
    color: "blue",

    marginHorizontal: 10,

    fontWeight: "600",
  },

  delete: {
    color: "red",

    fontWeight: "600",
  },
});
