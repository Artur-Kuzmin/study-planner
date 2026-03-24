"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Task {
  id: number | string;
  title: string;
  subject: string;
  dueDate: string;
  priority?: string;
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("All Subjects");

  const subjects = ["All Subjects", ...Array.from(new Set(tasks.map((t) => t.subject)))];
  const filteredTasks = selectedSubject === "All Subjects" 
    ? tasks 
    : tasks.filter((t) => t.subject === selectedSubject);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 sm:p-12 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              My Tasks
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Stay on top of your coursework and upcoming deadlines.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-200/50 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back Home
            </Link>
            <Link
              href="/tasks/new"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 shadow-sm dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Task
            </Link>
          </div>
        </header>

        <main>
          {!isLoading && !error && tasks.length > 0 && (
            <div className="mb-6 flex items-center justify-end">
              <label htmlFor="subject-filter" className="mr-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Filter by Subject:
              </label>
              <select
                id="subject-filter"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="block w-48 rounded-lg border-0 py-2 pl-3 pr-10 text-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-indigo-600 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-700 dark:focus:ring-indigo-500 shadow-sm"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-indigo-600 dark:border-zinc-800 dark:border-t-indigo-500"></div>
              <p className="mt-4 font-medium text-zinc-500 dark:text-zinc-400">Fetching tasks...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Couldn't load tasks</p>
              <p className="mt-2 text-zinc-500 dark:text-zinc-400">{error}</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">No tasks found</p>
              <p className="mt-2 text-zinc-500 dark:text-zinc-400">You're all caught up! Enjoy your free time.</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">No tasks match this subject</p>
              <p className="mt-2 text-zinc-500 dark:text-zinc-400">Try selecting a different subject or "All Subjects".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md dark:ring-zinc-800"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400">
                        {task.subject}
                      </span>
                      {task.completed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          Pending
                        </span>
                      )}
                    </div>
                    <h3 className={`text-lg font-semibold leading-snug tracking-tight mb-2 ${task.completed ? 'text-zinc-500 dark:text-zinc-500 line-through' : 'text-zinc-900 dark:text-zinc-100'}`}>
                      {task.title}
                    </h3>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                      <span>Due: {task.dueDate}</span>
                    </div>
                    {task.priority && (
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-sm ${task.priority === 'high'
                          ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                          : task.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                        }`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
