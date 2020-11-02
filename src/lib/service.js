import axios from "axios";

const API_URL = "http://localhost:3030/api";

export const saveTodo = (todo) => axios.post(`${API_URL}/todos`, todo);

export const loadTodos = () => axios.get(`${API_URL}/todos`);

export const deleteTodo = (id) => axios.delete(`${API_URL}/todos/${id}`);

export const updateTodo = (id, data) =>
  axios.put(`${API_URL}/todos/${id}`, data);
