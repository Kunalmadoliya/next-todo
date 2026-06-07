"use client";

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
// Ensure this path matches where you saved the TodoBoard component
import { TodoBoard } from "@/components/TodoBoard";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function Home() {
  const [appLaunched, setAppLaunched] = useState(false);

  // If the app is launched, unmount the landing page and render the Board
  if (appLaunched) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <TodoBoard />
      </motion.div>
    );
  }

  // Animation Variants
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200 relative overflow-x-hidden">
      {/* Dynamic Background Glow Anchors */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-blue-500/5 via-transparent to-transparent blur-3xl pointer-events-none" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"
      />
      <Navigation/>

      {/* ================= HERO SECTION ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-[11px] font-medium text-blue-400 uppercase tracking-wider"
          >
            <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
            Engineered for high-output teams
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-400 leading-[1.15]"
          >
            An ultra-minimalist environment for absolute task clarity.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed"
          >
            Eliminate cognitive clutter. Sync raw engineering objectives down to
            an intuitive, state-driven workflow built on top of elite modern
            architecture.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={() => setAppLaunched(true)}
              className="w-full sm:w-auto text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 active:scale-[0.98] cursor-pointer"
            >
              Start Syncing Free
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto text-center text-xs font-semibold border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 px-6 py-3.5 rounded-xl text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer"
            >
              Explore Architecture ↓
            </a>
          </motion.div>
        </motion.div>

        {/* ================= INTERFACE PREVIEW MOCKUP ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mt-16 border border-zinc-800/80 rounded-2xl bg-zinc-900/20 p-2 backdrop-blur-sm shadow-2xl relative group max-w-5xl mx-auto"
        >
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-zinc-800/50 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-950 overflow-hidden shadow-inner flex flex-col h-[320px] sm:h-[420px]">
            <div className="border-b border-zinc-900 px-4 py-3 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              </div>
              <span className="text-[10px] font-mono text-zinc-600 tracking-wider">
                workstream-feed.sys
              </span>
              <div className="w-12" />
            </div>

            <div className="flex-1 grid grid-cols-12 gap-4 p-4 opacity-40 pointer-events-none select-none overflow-hidden">
              <div className="col-span-4 space-y-3 hidden md:block">
                <div className="h-8 bg-zinc-900 rounded-lg" />
                <div className="h-32 bg-zinc-900/50 rounded-xl border border-zinc-800/40" />
                <div className="h-16 bg-zinc-900/50 rounded-xl border border-zinc-800/40" />
              </div>
              <div className="col-span-12 md:col-span-8 space-y-3">
                <div className="h-14 border border-blue-500/20 bg-gradient-to-r from-zinc-900 to-blue-950/10 rounded-xl" />
                <div className="h-20 border border-zinc-800 bg-zinc-900/30 rounded-xl" />
                <div className="h-20 border border-zinc-800 bg-zinc-900/30 rounded-xl" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= BENTO GRID FEATURES ================= */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          id="features"
          className="mt-32 space-y-4"
        >
          <div className="text-center md:text-left space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Core Protocol
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-200">
              Granular feature matrix
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "⚡",
                title: "Optimistic State Sync",
                desc: "Mutate client architecture instantly. Real-time updates push through with immediate rollback support.",
              },
              {
                icon: "🎛️",
                title: "Inline Layout Controls",
                desc: "Refactor titles seamlessly directly inside your current pipeline context without jarring modal triggers.",
              },
              {
                icon: "🎯",
                title: "Filtered Aggregations",
                desc: "Query items on demand using responsive active states. Dynamically track total output against incomplete logs.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-md flex flex-col justify-between group hover:border-zinc-700/60 transition-colors duration-300"
              >
                <span className="text-xl">{feature.icon}</span>
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-zinc-200">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ================= FINAL CALL TO ACTION ================= */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-32 border border-zinc-800/60 bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950/10 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
              Deploy your focus architecture today
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No configuration overhead required. Gain deep visibility over
              pending production deliverables inside a workspace configured
              explicitly for you.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setAppLaunched(true)}
                className="text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-950 px-6 py-3 rounded-xl transition-all active:scale-[0.98] shadow-md cursor-pointer"
              >
                Access Workstream Matrix
              </button>
            </div>
          </div>
        </motion.section>
      </main>
      <Footer/>
    </div>
  );
}
