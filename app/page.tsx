
"use client";
import AddTodoForm from "@/components/todos/AddTodoForm";
import TodoList from "@/components/todos/TodoList";

export default function Home() {

  // if (!user) {
  //   return (
  //     <main className="h-screen flex flex-col items-center justify-center">
  //       <h1>Welcome to Next Todo App</h1>
  //       <p>Please <Link href="/login">login</Link> or <Link href="/register">register</Link> to manage your todos.</p>
  //     </main>
  //   );
  // }

  return (
    <main className="h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Your Todos</h1>
        {/* <AddTodoForm /> */}
        <TodoList />
      </div>
    </main>
  );
}
