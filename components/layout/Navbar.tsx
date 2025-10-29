"use client";



import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logout from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
    // Start with null so the client initial render matches the server HTML.
    // Read localStorage only after mount to avoid hydration mismatches.
    const [currentUser, setCurrentUser] = useState<string | null>(null);

  // useEffect(() => {
  //   // update when other tabs change the currentUser key
  //   const handleStorage = (e: StorageEvent) => {
  //     if (e.key === "currentUser") setCurrentUser(e.newValue);
  //   };
  //   const handleCustom = (e: Event) => {
  //     // custom event from setCurrentUser
  //     const ev = e as CustomEvent<{ email: string | null }>;
  //     setCurrentUser(ev.detail?.email ?? null);
  //   };
  //   window.addEventListener("storage", handleStorage);
  //   window.addEventListener("currentUserChanged", handleCustom as EventListener);
  //   return () => window.removeEventListener("storage", handleStorage);
  // }, []);
    useEffect(() => {
      // defer reading localStorage until after mount to avoid hydration mismatch
      let t: number | undefined;
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("currentUser");
        // defer setting state slightly so it's not synchronous in the effect
        t = window.setTimeout(() => {
          setCurrentUser(stored);
        }, 0);
      }

      // update when other tabs change the currentUser key
      const handleStorage = (e: StorageEvent) => {
        if (e.key === "currentUser") setCurrentUser(e.newValue);
      };
      const handleCustom = (e: Event) => {
        // custom event from setCurrentUser
        const ev = e as CustomEvent<{ email: string | null }>;
        setCurrentUser(ev.detail?.email ?? null);
      };
      window.addEventListener("storage", handleStorage);
      window.addEventListener("currentUserChanged", handleCustom as EventListener);
      return () => {
        if (typeof t !== "undefined") clearTimeout(t);
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener("currentUserChanged", handleCustom as EventListener);
      };
    }, []);

  const handleLogout = async () => {
    // Clear client storage and notify server in background
    await logout({ callApi: true });
    // update local state immediately so UI updates before navigation
    setCurrentUser(null);
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 flex items-center">
      <Link href="/" className="text-white mr-4">Home</Link>

      {!currentUser ? (
        <>
          <Link href="/login" className="text-white mr-4">Login</Link>
          <Link href="/register" className="text-white mr-4">Register</Link>
        </>
      ) : (
        <div className="flex items-center gap-3 ml-4">
          <span className="text-gray-300 text-sm">{currentUser}</span>
          <Link href="/settings" className="text-white mr-4">Settings</Link>
        </div>
      )}

      <div className="ml-auto">

        {currentUser ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            aria-label="Logout"
          >
            Logout
          </button>
        ) : null}
      </div>
    </nav>
  );
}
