"use client";

import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
  type Todo,
} from "../lib/todos";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function TodoBoard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Filter State
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");

  // Inline Editing States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Toast Notifications State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerToast = useCallback((
    message: string,
    type: "success" | "error" = "success",
  ) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tasks");
      triggerToast("Database synchronization failed", "error");
    } finally {
      setLoading(false);
    }
  }, [triggerToast]);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    const done = todos.filter((t) => t.completed).length;
    return {
      total: todos.length,
      done,
      active: todos.length - done,
    };
  }, [todos]);

  const visible = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "done") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    if (!trimmedTitle || !trimmedDesc) return;

    setSubmitting(true);
    setError(null);
    try {
      const created = await createTodo({
        title: trimmedTitle,
        description: trimmedDesc,
      });
      setTodos((prev) => [created, ...prev]);
      setTitle("");
      setDescription("");
      triggerToast("Task created successfully");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to create task";
      setError(msg);
      triggerToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  function startEditing(todo: Todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  }

  async function handleSaveEdit(id: string) {
    const trimmedTitle = editTitle.trim();
    const trimmedDesc = editDescription.trim();
    if (!trimmedTitle || !trimmedDesc) return;

    setUpdatingId(id);
    setError(null);
    try {
      const updated = await updateTodo(id, {
        title: trimmedTitle,
        description: trimmedDesc,
      });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setEditingId(null);
      triggerToast("Task updated successfully");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to update task";
      setError(msg);
      triggerToast(msg, "error");
    } finally {
      setUpdatingId(null);
    }
  }

  async function toggleComplete(todo: Todo) {
    setError(null);
    const next = !todo.completed;
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: next } : t)),
    );
    try {
      const updated = await updateTodo(todo.id, { completed: next });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
      triggerToast(next ? "Task marked completed" : "Task reactivated");
    } catch (e) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id ? { ...t, completed: todo.completed } : t,
        ),
      );
      const msg =
        e instanceof Error ? e.message : "Failed to modify task status";
      setError(msg);
      triggerToast(msg, "error");
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    const snapshot = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTodo(id);
      triggerToast("Task permanently removed");
    } catch (e) {
      setTodos(snapshot);
      const msg = e instanceof Error ? e.message : "Failed to delete task";
      setError(msg);
      triggerToast(msg, "error");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 lg:p-12 font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200 relative flex justify-center items-start">
      {/* Premium System Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl text-sm shadow-2xl transition-all duration-300 scale-100 animate-in fade-in slide-in-from-top-4 ${
            toast.type === "error"
              ? "bg-red-950/80 border-red-800/50 text-red-200"
              : "bg-zinc-900/90 border-zinc-800 text-zinc-100"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${toast.type === "error" ? "bg-red-500" : "bg-blue-500"}`}
          />
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT SIDE: MANAGEMENT & FILTERS (5 Columns) ================= */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-12">
          
          {/* Filter Tab List Container */}
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 backdrop-blur-md shadow-sm">
            <div
              className="bg-zinc-950 p-1 rounded-xl border border-zinc-800/60 flex gap-1"
              role="tablist"
            >
              {(["all", "active", "done"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={filter === key}
                  className={`flex-1 text-center text-xs py-2 rounded-lg font-medium transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                    filter === key
                      ? "bg-zinc-100 text-zinc-950 font-semibold shadow-md"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                  }`}
                  onClick={() => setFilter(key)}
                >
                  {key === "all"
                    ? "All Tasks"
                    : key === "active"
                      ? "In Progress"
                      : "Done"}
                </button>
              ))}
            </div>
          </section>

          {/* Creation Form Element Container */}
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-zinc-700/60">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-4">
              Add New Task
            </p>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Task title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                  maxLength={120}
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Provide additional details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium resize-none min-h-[110px]"
                  rows={3}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white py-3.5 px-4 rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-blue-600/10 mt-2 cursor-pointer"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Add Task"}
              </button>
            </form>
          </section>

          {/* Metrics Panel Layout */}
          <section
            className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 backdrop-blur-md shadow-sm"
            aria-label="Metrics Dashboard"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
              Overview
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/40">
                <span className="text-2xl font-semibold text-zinc-100">
                  {stats.total}
                </span>
                <span className="text-[11px] font-medium text-zinc-500 mt-0.5">
                  Total
                </span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/40">
                <span className="text-2xl font-semibold text-blue-400">
                  {stats.active}
                </span>
                <span className="text-[11px] font-medium text-zinc-500 mt-0.5">
                  Pending
                </span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/40">
                <span className="text-2xl font-semibold text-emerald-400">
                  {stats.done}
                </span>
                <span className="text-[11px] font-medium text-zinc-500 mt-0.5">
                  Completed
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* ================= RIGHT SIDE: WORKSTREAM LIST (7 Columns) ================= */}
        <div className="lg:col-span-7">
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 backdrop-blur-md min-h-[600px] shadow-sm flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-6">
              <h2 className="text-lg font-semibold text-zinc-200">
                Workstream Feed
              </h2>
              <span className="text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                {visible.length + 1} items rendered
              </span>
            </div>

            {error && (
              <div
                className="mb-6 p-4 bg-red-950/30 border border-red-900/40 rounded-xl text-red-400 text-xs font-medium"
                role="alert"
              >
                Error System Notification: {error}
              </div>
            )}

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[750px] pr-1">
              <ul className="space-y-4">
                {/* ================= UNALTERABLE SYSTEM CARD: SOCIAL NETWORK ARCHWAY ================= */}
                <li className="p-5 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950/20 shadow-md relative overflow-hidden group transition-all duration-300 hover:border-blue-500/50">
                  <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-start gap-4">
                    {/* Visual Portal Dot Anchor */}
                    <div className="mt-1 relative flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full border-2 border-blue-500/50 bg-zinc-950 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4 flex-wrap sm:flex-nowrap">
                        <div>
                          <h3 className="text-sm font-bold tracking-tight text-zinc-100 flex items-center gap-1.5">
                            Kunal Madoliya
                            <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                              Verified Dev
                            </span>
                          </h3>
                          
                        </div>
                      
                      </div>
                      
                      <p className="text-xs mt-3 leading-relaxed text-zinc-400">
                        Connect across professional networks. Access live production deployments, architectural write-ups, and structural source repositories.
                      </p>

                      {/* Social Grid Connect Layout */}
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <a
                          href="https://x.com/kunalmadoliya"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700/80 text-zinc-300 hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 hover:bg-zinc-900/80 group/link"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-zinc-500 group-hover/link:text-blue-400 transition-colors font-mono">𝕏</span>
                            Twitter / X
                          </span>
                          <span className="text-[10px] text-zinc-600 group-hover/link:text-zinc-400 transition-colors">↗</span>
                        </a>
                        <a
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700/80 text-zinc-300 hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 hover:bg-zinc-900/80 group/link"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-zinc-500 group-hover/link:text-blue-400 transition-colors font-mono">in</span>
                            LinkedIn
                          </span>
                          <span className="text-[10px] text-zinc-600 group-hover/link:text-zinc-400 transition-colors">↗</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </li>

                {/* ================= DYNAMIC TASK LIST MATRIX ================= */}
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center py-32 gap-3">
                    <span className="w-6 h-6 border-2 border-zinc-800 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-xs text-zinc-500 font-medium">
                      Syncing live stream...
                    </p>
                  </div>
                ) : visible.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-24 px-6 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20">
                    <p className="text-sm text-zinc-500 font-medium">
                      {filter === "all"
                        ? "No additional records active. Populate your schedule."
                        : "No records match active parameters."}
                  </p>
                  </div>
                ) : (
                  visible.map((todo) => {
                    const isEditing = editingId === todo.id;

                    return (
                      <li
                        key={todo.id}
                        className={`p-5 rounded-2xl border transition-all duration-300 ease-out transform hover:-translate-y-0.5 shadow-sm flex flex-col gap-4 bg-zinc-900/60 ${
                          todo.completed
                            ? "border-zinc-800/40 opacity-70"
                            : isEditing
                              ? "border-blue-500/50 bg-zinc-900/90 shadow-md ring-2 ring-blue-500/5"
                              : "border-zinc-800/80 hover:border-zinc-700/80"
                        }`}
                      >
                        {isEditing ? (
                          /* INLINE UPDATE CONTROLS MODE */
                          <div className="space-y-3 animate-in fade-in duration-200">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                              Editing Mode
                            </p>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full text-sm font-semibold px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-blue-500 text-zinc-100"
                              placeholder="Update title..."
                              required
                            />
                            <textarea
                              value={editDescription}
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                              className="w-full text-xs px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-blue-500 text-zinc-300 resize-none"
                              placeholder="Update description..."
                              rows={2}
                              required
                            />
                            <div className="flex gap-2 justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="px-3 py-1.5 text-xs font-medium border border-zinc-800 rounded-lg text-zinc-400 hover:bg-zinc-950 hover:text-zinc-200 transition cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleSaveEdit(todo.id)}
                                disabled={updatingId === todo.id}
                                className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50 cursor-pointer"
                              >
                                {updatingId === todo.id
                                  ? "Saving..."
                                  : "Save Changes"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* STANDARD DISPLAY MODE */
                          <>
                            <div className="flex items-start gap-4">
                              {/* Apple Checkbox Setup */}
                              <label className="relative flex items-center justify-center mt-0.5 cursor-pointer select-none group">
                                <input
                                  type="checkbox"
                                  checked={todo.completed}
                                  onChange={() => void toggleComplete(todo)}
                                  className="sr-only peer"
                                />
                                <div className="w-5 h-5 rounded-full border-2 border-zinc-700 bg-zinc-950 group-hover:border-zinc-500 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-200 flex items-center justify-center after:content-[''] after:hidden peer-checked:after:block after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45 after:-mt-0.5" />
                              </label>

                              {/* Content Fields */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline justify-between gap-4 flex-wrap sm:flex-nowrap">
                                  <h3
                                    className={`text-sm font-semibold tracking-tight transition-all duration-300 break-words ${
                                      todo.completed
                                        ? "text-zinc-500 line-through decoration-zinc-600"
                                        : "text-zinc-100"
                                    }`}
                                  >
                                    {todo.title}
                                  </h3>
                                  <time
                                    className="text-[10px] font-medium text-zinc-500 bg-zinc-950/60 border border-zinc-800/40 px-2 py-0.5 rounded-md whitespace-nowrap"
                                    dateTime={todo.createdAt}
                                  >
                                    {formatDate(todo.createdAt)}
                                  </time>
                                </div>
                                <p
                                  className={`text-xs mt-2 leading-relaxed break-words transition-all duration-300 ${
                                    todo.completed
                                      ? "text-zinc-600"
                                      : "text-zinc-400"
                                  }`}
                                >
                                  {todo.description}
                                </p>
                              </div>
                            </div>

                            {/* Standard Action Operations Bar */}
                            <div className="flex gap-2 justify-end border-t border-zinc-800/40 pt-3 mt-1">
                              <button
                                type="button"
                                disabled={todo.completed}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-800/60 text-zinc-300 hover:text-zinc-100 disabled:opacity-20 disabled:pointer-events-none transition cursor-pointer"
                                onClick={() => startEditing(todo)}
                                aria-label={`Edit ${todo.title}`}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-950/40 hover:border-red-900/60 bg-red-950/20 hover:bg-red-900/20 text-red-400 hover:text-red-300 transition cursor-pointer"
                                onClick={() => void handleDelete(todo.id)}
                                aria-label={`Delete ${todo.title}`}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}