"use client";
import { useState } from "react";

import CustomButton from "@/components/ui/Button";
export default function AddTodoForm() {
  const [title, setTitle] = useState("");
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    const user = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null;
    if (!user) {
      alert("Please login to add todos");
      return;
    }
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title, userEmail: user }),
      headers: { "Content-Type": "application/json" }
    });
    setTitle("");
    window.location.reload();
  }
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        className="border px-3 py-2 rounded"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Add new todo"
      />
      <CustomButton type="submit">Add</CustomButton>
    </form>
  );
}
