const API_URL = "http://10.0.2.2:5000/api";

// GET
export const getTodos = async () => {
  const response = await fetch(`${API_URL}/todos`);

  const result = await response.json();

  return result.data;
};

// CREATE
export const createTodo = async (title) => {
  const response = await fetch(`${API_URL}/todos`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      title: title,
    }),
  });

  const result = await response.json();

  return result.data;
};

// UPDATE
export const updateTodo = async (id, data) => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  return result.data;
};

// DELETE
export const deleteTodo = async (id) => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  return result;
};