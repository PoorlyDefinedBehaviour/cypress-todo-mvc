import React from "react";

export const TodoForm = (props) => (
  <form onSubmit={props.handleTodoSubmit}>
    <input
      type="text"
      autoFocus
      value={props.currentTodo}
      onChange={props.handleNewTodoChange}
      className="new-todo"
      placeholder="What needs to be done?"
    />
  </form>
);
