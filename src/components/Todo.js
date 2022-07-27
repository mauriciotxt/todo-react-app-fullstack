import React, { useState, useId, useEffect } from "react";
import TodoForm from "./TodoForm";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";

const Todo = ({ todos, completeTodo, removeTodo, updateTodo }) => {
  const reactId = useId();

  const [edit, setEdit] = useState({
    id: null,
    status: "",
    value: "",
  });

  const submitUpdate = (value) => {
    updateTodo(
      edit.id,
      value?.text ? value?.text : "something went wrong",
      edit.status
    );
    setEdit({
      id: null,
      status: "",
      value: "",
    });
  };

  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={submitUpdate} />;
  }

  return (
    <>
      {todos &&
        todos.map((todo, index) => {
          const { id, status, task: value } = todo;

          return (
            <div
              onDoubleClick={() => completeTodo(id)}
              className={
                status !== "completed" ? "todo-row complete" : "todo-row"
              }
              key={reactId + index}
            >
              <div key={reactId + id} className="todo-row-values">
                <div>{value}</div>
              </div>
              <div className="icons">
                <RiCloseCircleLine
                  onClick={() => removeTodo(id, status ?? "")}
                  className="delete-icon"
                />
                <TiEdit
                  onClick={() => setEdit({ id, value, status })}
                  className="edit-icon"
                />
              </div>
            </div>
          );
        })}
    </>
  );
};

export default Todo;
