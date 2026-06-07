"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

type FilterState = "all" | "active" | "completed";

// --- SVG Icons (Inline for zero-dependency drop-in) ---
const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function TodoBoard() {
  // --- State ---
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      text: "Initialize Next.js application core",
      completed: true,
      createdAt: parseInt("Now"),
    },
    {
      id: "2",
      text: "Implement Framer Motion layout transitions",
      completed: false,
      createdAt: parseInt("Now"),
    },
    {
      id: "3",
      text: "Deploy to Vercel production edge",
      completed: false,
      createdAt:  parseInt("Now"),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterState>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const editInputRef = useRef<HTMLInputElement>(null);

  // Focus the edit input immediately when inline editing begins
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  // --- Derived State (Filtered Aggregations) ---
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt); // Newest first
  }, [tasks, filter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, progress };
  }, [tasks]);

  // --- Handlers ---
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setInputValue("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditValue(task.text);
  };

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...t, text: editValue.trim() } : t,
        ),
      );
    }
    setEditingId(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased relative overflow-hidden flex flex-col items-center pt-20 pb-32 px-4 sm:px-6">
      {/* Background Ambience */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-blue-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 space-y-8">
        {/* Header & Stats */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl border border-blue-500/40 bg-zinc-900/50 flex items-center justify-center shadow-inner">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              </div>
              Workstream Matrix
            </h1>
            <div className="text-right">
              <span className="text-3xl font-bold text-zinc-200 tracking-tighter">
                {stats.progress}%
              </span>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                System Output
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
            <motion.div
              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${stats.progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </header>

        {/* Input Pipeline */}
        <form onSubmit={handleAddTask} className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur" />
          <div className="relative flex items-center bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-md shadow-lg">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Initialize new objective..."
              className="flex-1 bg-transparent border-none text-sm text-zinc-200 px-5 py-4 focus:outline-none focus:ring-0 placeholder:text-zinc-600"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="mr-2 p-2.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 hover:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PlusIcon />
            </button>
          </div>
        </form>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 p-1 bg-zinc-900/40 border border-zinc-800/60 rounded-xl backdrop-blur-sm w-max">
          {(["all", "active", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative px-4 py-1.5 text-xs font-semibold capitalize rounded-lg transition-colors ${
                filter === f
                  ? "text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {filter === f && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-zinc-800 rounded-lg border border-zinc-700/50 shadow-sm"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12 border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/10"
              >
                <p className="text-sm text-zinc-500 font-medium">
                  No {filter !== "all" ? filter : ""} objectives found.
                </p>
              </motion.div>
            ) : (
              filteredTasks.map((task) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    transition: { duration: 0.2 },
                  }}
                  key={task.id}
                  className={`group relative flex items-center gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                    task.completed
                      ? "bg-zinc-900/20 border-zinc-800/40"
                      : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700/80 hover:bg-zinc-900/60"
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      task.completed
                        ? "bg-blue-500 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                        : "border-zinc-600 bg-transparent text-transparent hover:border-blue-400"
                    }`}
                  >
                    <CheckIcon />
                  </button>

                  {/* Task Content / Inline Editing */}
                  <div
                    className="flex-1 min-w-0"
                    onDoubleClick={() => startEditing(task)}
                  >
                    {editingId === task.id ? (
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={handleEditKeyDown}
                        className="w-full bg-zinc-950 border border-blue-500/50 rounded bg-transparent px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <p
                        className={`text-sm truncate select-none transition-colors duration-300 ${
                          task.completed
                            ? "text-zinc-500 line-through decoration-zinc-700"
                            : "text-zinc-200"
                        }`}
                      >
                        {task.text}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                      title="Delete objective"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
