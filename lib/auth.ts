export type LogoutOptions = {
  clearAll?: boolean; // if true, calls localStorage.clear()
  keys?: string[]; // specific keys to remove
  callApi?: boolean; // whether to notify server-side logout endpoint
};

export async function logout(options: LogoutOptions = {}) {
  try {
    if (typeof window !== "undefined") {
      if (options.clearAll) {
        localStorage.clear();
      } else {
        const keys = options.keys ?? ["currentUser"];
        keys.forEach((k) => localStorage.removeItem(k));
      }
    }

    
  } catch {
    if (options.callApi) {
      // best-effort server notification; ignore errors
    //   await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    }


  }
}

export default logout;

export function setCurrentUser(email: string | null) {
  if (typeof window === "undefined") return;
  if (email === null) {
    localStorage.removeItem("currentUser");
  } else {
    localStorage.setItem("currentUser", email);
  }
  // Dispatch a custom event so same-tab listeners can react immediately
  try {
    const ev = new CustomEvent("currentUserChanged", { detail: { email } });
    window.dispatchEvent(ev);
  } catch {
    // ignore if event dispatching fails in some environments
  }
}

