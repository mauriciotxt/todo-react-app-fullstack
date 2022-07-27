import React, { useState, useEffect, useCallback } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import {
  GET_TODOS_SUFFIX,
  UPDATE_TODO_SUFFIX,
  CREATE_TODO_SUFFIX,
  DELETE_TODO_SUFFIX,
  apiBaseUrl,
} from "../lib/api";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const getAllTodos = apiBaseUrl + GET_TODOS_SUFFIX;
  const createTodo = apiBaseUrl + CREATE_TODO_SUFFIX;
  const patchTodo = apiBaseUrl + UPDATE_TODO_SUFFIX;
  const deleteTodo = apiBaseUrl + DELETE_TODO_SUFFIX;

  useEffect(() => {
    setLoading(true);

    let wait = false;
    try {
      const getData = async () => {
        const response = await fetch(getAllTodos);
        const data = await response.json();
        setTodos(data["Items"]);
      };

      !wait && getData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    return () => {
      wait = true;
    };
  }, [getAllTodos]);

  const addTodo = async (todo) => {
    try {
      if (!todo.text || /^\s*$/.test(todo.text)) {
        return;
      }

      setLoading(true);

      const newTodos = [todo, ...todos];

      setTodos(newTodos);

      const getData = async () => {
        const response = await fetch(createTodo, {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uuid: todo.id,
            status: todo.status,
            task: todo.text,
          }),
        });

        const data = await response.json();

        if (!data.error) {
          window.location.reload();
        }
      };

      getData();
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error?.msg ??
          "Something went wrong with this todo creation. Try to refresh the page."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (todoId, newValue, newStatus) => {
    try {
      if (!newValue || /^\s*$/.test(newValue)) {
        return;
      }
      setLoading(true);

      let prevItem = {};

      setTodos((prev) =>
        prev.map((item) => {
          prevItem = item;
          return item.id === todoId ? newValue : item;
        })
      );

      const getData = async () => {
        const response = await fetch(patchTodo, {
          method: "PATCH",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uuid: todoId,
            status: newStatus || prevItem?.status,
            task: newValue || prevItem?.status,
          }),
        });
        const data = await response.json();

        if (!data.error) {
          window.location.reload();
        }
      };

      getData();
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error?.msg ??
          "Something went wrong with this todo update. Try to refresh the page."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeTodo = async (id, status) => {
    try {
      const removedArr = [...todos].filter((todo) => todo.id !== id);

      setLoading(true);

      setTodos(removedArr);

      const getData = async () => {
        const response = await fetch(deleteTodo, {
          method: "DELETE",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uuid: id,
            status,
          }),
        });

        const data = await response.json();
      };

      getData();
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error?.msg ??
          "Something went wrong with this todo creation. Try to refresh the page."
      );
    } finally {
      setLoading(false);
    }
  };

  const completeTodo = useCallback(async (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        switch (todo.status) {
          case "completed":
            todo.status = "incomplete";
            break;
          case "incomplete":
            todo.status = "completed";
            break;
          default:
            todo.status = "completed";
            break;
        }
      }
      return todo;
    });

    setTodos(() => updatedTodos);
  });

  return (
    <>
      {loading && <h1>Loading...</h1>}
      {!loading && errorMessage && (
        <section>
          <h1>{JSON.stringify(errorMessage)}</h1>
          <button onClick={() => window.location.reload()}>
            Click here to Refresh the Page
          </button>
        </section>
      )}
      {!loading && !errorMessage && todos.length > 0 && (
        <>
          <h1>What's the Plan for Today?</h1>
          <TodoForm onSubmit={addTodo} />
          <Todo
            todos={todos}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
            updateTodo={updateTodo}
          />
        </>
      )}
    </>
  );
}

export default TodoList;
