"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTaskPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    dueDate: "",
    priority: "medium",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.subject.trim() || !formData.dueDate) {
      setError("Please fill out all required fields.");
      return;
    }

    let formattedDate = formData.dueDate;
    try {
      const dateObj = new Date(formData.dueDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split("T")[0];
      }
    } catch (err) {
      // Keep original input if parsing fails
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          subject: formData.subject.trim(),
          dueDate: formattedDate,
          priority: formData.priority,
          completed: false,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      router.push("/tasks");
      router.refresh(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 sm:p-12 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Create New Task
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Add a new assignment or study goal.
            </p>
          </div>
          <div>
            <Link
              href="/tasks"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-200/50 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              Cancel
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-xl rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 sm:p-10">
          {error && (
            <div className="mb-8 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-500/10 dark:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
              </svg>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col space-y-7">
            <div className="flex flex-col space-y-2.5">
              <label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Task Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="block w-full rounded-xl border-0 bg-zinc-50 dark:bg-zinc-950 py-3.5 px-4 text-zinc-900 dark:text-zinc-50 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm transition-shadow"
                placeholder="e.g. Read chapter 5"
              />
            </div>
            
            <div className="flex flex-col space-y-2.5">
              <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Subject or Course
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="block w-full rounded-xl border-0 bg-zinc-50 dark:bg-zinc-950 py-3.5 px-4 text-zinc-900 dark:text-zinc-50 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm transition-shadow"
                placeholder="e.g. Mathematics"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <div className="flex flex-col space-y-2.5">
                <label htmlFor="dueDate" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  required
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-0 bg-zinc-50 dark:bg-zinc-950 py-3.5 px-4 text-zinc-900 dark:text-zinc-50 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm transition-shadow"
                />
              </div>
              
              <div className="flex flex-col space-y-2.5">
                <label htmlFor="priority" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-xl border-0 bg-zinc-50 dark:bg-zinc-950 py-3.5 pl-4 pr-10 text-zinc-900 dark:text-zinc-50 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm transition-shadow cursor-pointer"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="h-4 w-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 pb-2 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M5 12h14" />
                      <line x1="12" y1="5" x2="12" y2="19" />
                    </svg>
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
