"use client";
import React, { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import {
  List, ListItem, Checkbox, IconButton,
  TextField, Button, ListItemText
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Edit } from "@mui/icons-material";
import type { Todo } from "@/types/todo";
import { green, red } from "@mui/material/colors";


export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState<string>("");
  const [user, setUser] = useState<string | null>(null);

  // Read currentUser after mount to avoid hydration mismatch and update on storage events
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentUser");
      // apply asynchronously to avoid synchronous setState in render
      const t = window.setTimeout(() => setUser(stored), 0);
      const handleStorage = (e: StorageEvent) => {
        if (e.key === "currentUser") setUser(e.newValue);
      };
      const handleCustom = (e: Event) => {
        const ev = e as CustomEvent<{ email: string | null }>;
        setUser(ev.detail?.email ?? null);
      };
      window.addEventListener("storage", handleStorage);
      window.addEventListener("currentUserChanged", handleCustom as EventListener);
      return () => {
        clearTimeout(t);
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener("currentUserChanged", handleCustom as EventListener);
      };
    }
    return;
  }, []);

  // Fetch todos from MongoDB
  useEffect(() => {
    async function fetchTodos() {
      if (user) {
        const res = await fetch(`/api/todos?email=${encodeURIComponent(user)}`);
        const data = await res.json();
        setTodos(data);
      }
    }
    fetchTodos();
  }, [user]);

  // Add new todo
  const addTodo = async () => {
    if (!task.trim() || !user) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: task, userEmail: user }),
    });
    if (res.ok) {
      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
      setTask("");
    }
  };

  // Toggle completed
  const toggleTodo = async (i: number) => {
    const todo = todos[i];
    const res = await fetch(`/api/todos/${todo._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTodos(
        todos.map((t, idx) =>
          idx === i ? { ...t, completed: updated.completed } : t
        )
      );
    }
  };

  // Remove todo
  const removeTodo = async (i: number) => {
    const todo = todos[i];
    const res = await fetch(`/api/todos/${todo._id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setTodos(todos.filter((_, idx) => idx !== i));
    }
  };


  // update todo (edit title)
  const updateTodo = async (i: number) => {
    const todo = todos[i];
    const newTitle = window.prompt("Edit todo", todo.title);
    if (newTitle === null) return; // user cancelled
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    const res = await fetch(`/api/todos/${todo._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTodos(
        todos.map((t, idx) => (idx === i ? { ...t, title: updated.title } : t))
      );
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) addTodo();
  };

  return (
    <>
      <TextField
        value={task}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTask(e.target.value)}
        label="Add Todo"
        fullWidth
        onKeyDown={handleInputKeyDown}
        margin="normal"
      />
      <Button
        variant="contained"
        onClick={addTodo}
        disabled={!task.trim() || !user}
        sx={{ mb: 2 }}
      >
        Add
      </Button>
      <List>
        {todos.map((todo, i) => (
          <ListItem key={todo._id} divider>
            <Checkbox
              checked={todo.completed}
              onChange={() => toggleTodo(i)}
              tabIndex={-1}
            />
            <ListItemText
              primary={todo.title}
              sx={{ textDecoration: todo.completed ? "line-through" : "none" }}
            />
            <div className="flex justify-between items-center">
              <IconButton edge="end" aria-label="edit" onClick={() => updateTodo(i)} sx={{ mr: 1, color: green[500] }}>
                <Edit />
              </IconButton>

              <IconButton edge="end" aria-label="delete" onClick={() => removeTodo(i)}  sx={{color:red[500]}}>
                <DeleteIcon />
              </IconButton>
            </div>
          </ListItem>
        ))}
      </List>
    </>
  );
}

