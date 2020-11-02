import React, { Component, useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { TodoForm, TodoList, Footer } from "./components";
import { saveTodo, loadTodos, deleteTodo, updateTodo } from "./lib/service";

export const App = () => {
  const [currentTodo, setCurrentTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadTodos()
      .then(({ data }) => setTodos(data))
      .catch(() => setError(true));
  }, []);

  const handleNewTodoChange = (event) => setCurrentTodo(event.target.value);

  const handleTodoSubmit = (event) => {
    event.preventDefault();

    saveTodo({
      name: currentTodo,
      isComplete: false,
    })
      .then(({ data: todo }) => {
        setTodos((oldTodos) => oldTodos.concat(todo));
        setCurrentTodo("");
      })
      .catch(() => setError(true));
  };

  const handleDeleteTodo = (id) => {
    deleteTodo(id).then(() =>
      setTodos((oldTodos) => oldTodos.filter((todo) => todo.id !== id))
    );
  };

  const handleToggle = (id) => {
    const todo = todos.find((todo) => todo.id === id);

    updateTodo(id, { ...todo, isComplete: !todo.isComplete }).then(({ data }) =>
      setTodos((oldTodos) => oldTodos.map((t) => (t.id === id ? data : t)))
    );
  };

  const filterTodos = (filter) => {
    if (filter === "completed") {
      return todos.filter((todo) => todo.isComplete);
    }

    if (filter === "active") {
      return todos.filter((todo) => !todo.isComplete);
    }

    return todos;
  };

  const remainingTodos = todos.filter((todo) => !todo.isComplete).length;

  return (
    <Router>
      <div>
        <header className="header">
          <h1>todos</h1>
          {error && <span className="error">Oh no!</span>}
          <TodoForm
            currentTodo={currentTodo}
            handleNewTodoChange={handleNewTodoChange}
            handleTodoSubmit={handleTodoSubmit}
          />
        </header>
        <section className="main">
          <Route
            path="/:filter?"
            render={({ match }) => (
              <TodoList
                todos={filterTodos(match.params.filter)}
                handleDeleteTodo={handleDeleteTodo}
                handleToggle={handleToggle}
              />
            )}
          />
        </section>
        <Footer remainingTodos={remainingTodos} />
      </div>
    </Router>
  );
};
